import pytest
from fastapi.testclient import TestClient
from main import app
from services.session_manager import SessionStateManager, get_session_manager


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def manager():
    return SessionStateManager(db_path=":memory:")


def test_thread_context_isolation(manager):
    # Create two separate threads
    sess_a = manager.create_session(thread_id="thread_A", title="Thread A - IL6 Investigation")
    sess_b = manager.create_session(thread_id="thread_B", title="Thread B - TYK2 Investigation")

    # Send turn to Thread A
    manager.add_turn("thread_A", "Investigating IL6 in SLE", "IL6 SWAG score is 8.94", intent="DEFINITIONAL")

    # Send turn to Thread B
    manager.add_turn("thread_B", "Investigating TYK2 in Psoriasis", "TYK2 SWAG score is 8.75", intent="DEFINITIONAL")

    # Verify context isolation
    history_a = manager.get_context("thread_A")
    history_b = manager.get_context("thread_B")

    assert len(history_a) == 2
    assert len(history_b) == 2

    # Thread A must not contain TYK2 or Thread B text
    content_a = " ".join([t.content for t in history_a])
    assert "IL6" in content_a
    assert "TYK2" not in content_a

    # Thread B must not contain IL6 or Thread A text
    content_b = " ".join([t.content for t in history_b])
    assert "TYK2" in content_b
    assert "IL6" not in content_b


def test_bounded_clarification_loop_max_2_turns(manager):
    tid = "thread_clarif_test"
    manager.create_session(thread_id=tid)

    # Turn 1: Vague query -> Expect Clarification Round 1
    resp1 = manager.process_message(tid, "The test failed")
    assert resp1.clarificationCount == 1
    assert resp1.isPivot is False
    assert "clarify whether you are referring to" in resp1.response

    # Turn 2: Second vague reply -> Expect Clarification Round 2
    resp2 = manager.process_message(tid, "it gave an error")
    assert resp2.clarificationCount == 2
    assert resp2.isPivot is False
    assert "candidate inhibitor cohort" in resp2.response

    # Turn 3: Third vague reply -> Must PIVOT! Stop asking clarifying questions.
    resp3 = manager.process_message(tid, "why did it fail")
    assert resp3.isPivot is True
    assert len(resp3.assumptions) > 0
    assert len(resp3.qcSuggestions) > 0
    assert "Actionable QC & Instrument Diagnostic Checks" in resp3.response
    assert "Spectrophotometer / Flow Cytometer Calibration" in resp3.response


def test_idk_immediate_pivot_to_qc_checks(manager):
    tid = "thread_idk_test"
    manager.create_session(thread_id=tid)

    # Turn 1: Vague query -> Clarification Round 1
    resp1 = manager.process_message(tid, "The assay didn't work")
    assert resp1.clarificationCount == 1
    assert resp1.isPivot is False

    # Turn 2: User says "I don't know" -> Immediately pivot to best-effort & QC suggestions
    resp2 = manager.process_message(tid, "I don't know")
    assert resp2.isPivot is True
    assert len(resp2.assumptions) > 0
    assert len(resp2.qcSuggestions) > 0
    assert "Best-Effort Diagnostic Resolution" in resp2.response
    assert "Buffer Integrity" in resp2.response
    assert "This diagnostic guidance is a starting point and does not replace PI or lab-lead review." in resp2.response


def test_session_api_endpoints(client):
    # 1. Create Session
    res_create = client.post("/api/session/create", json={"threadId": "api_test_thread", "title": "API Test"})
    assert res_create.status_code == 200
    assert res_create.json()["threadId"] == "api_test_thread"

    # 2. Chat in Session
    res_chat = client.post("/api/session/api_test_thread/chat", json={"message": "What is mTORC1 in IL-23 signaling?"})
    assert res_chat.status_code == 200
    data_chat = res_chat.json()
    assert data_chat["intent"] == "DEFINITIONAL"
    assert len(data_chat["citations"]) > 0

    # 3. Get History
    res_hist = client.get("/api/session/api_test_thread/history")
    assert res_hist.status_code == 200
    assert len(res_hist.json()) == 2

    # 4. Delete Session
    res_del = client.delete("/api/session/api_test_thread")
    assert res_del.status_code == 200
    assert res_del.json()["status"] == "deleted"
