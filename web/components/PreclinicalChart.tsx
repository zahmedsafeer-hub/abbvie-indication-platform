"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";
import { PreclinicalSampleData, CompoundPreclinicalData } from "@/types/platform";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PreclinicalChartProps {
  data: PreclinicalSampleData;
}

export function PreclinicalChart({ data }: PreclinicalChartProps) {
  const [selectedRoute, setSelectedRoute] = useState<"all" | "intraperitoneal" | "oral" | "topical">("all");

  const chartData = data.compounds.map((c: CompoundPreclinicalData) => {
    const ipArm = c.dosageArms.find((a) => a.route === "intraperitoneal");
    const oralArm = c.dosageArms.find((a) => a.route === "oral");
    const topicalArm = c.dosageArms.find((a) => a.route === "topical");

    return {
      compound: c.compoundId,
      name: c.compoundName,
      log2FC: Math.abs(c.log2FC),
      ipIC50: ipArm ? ipArm.ic50 : 0,
      oralIC50: oralArm ? oralArm.ic50 : 0,
      topicalIC50: topicalArm ? topicalArm.ic50 : 0,
      ipEfficacy: ipArm ? ipArm.efficacyPercent : 0,
      oralEfficacy: oralArm ? oralArm.efficacyPercent : 0,
      topicalEfficacy: topicalArm ? topicalArm.efficacyPercent : 0,
    };
  });

  return (
    <Card className="w-full bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>γδ17 T-cell Repurposing Screen: Route-Specific IC50 & Efficacy</span>
              <Badge variant="purple">IL-23 / mTORC1/2 / Src Axis</Badge>
            </CardTitle>
            <CardDescription className="text-slate-400 mt-1">
              Comparative potency across Intraperitoneal, Oral, and Topical arms in the imiquimod-induced skin inflammation model
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            {(["all", "intraperitoneal", "oral", "topical"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRoute(r)}
                className={`text-xs px-2.5 py-1 rounded transition-colors capitalize ${
                  selectedRoute === r
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="compound" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                label={{
                  value: "IC50 (nM) - Lower is More Potent",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.5rem",
                  color: "#f8fafc",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              {(selectedRoute === "all" || selectedRoute === "intraperitoneal") && (
                <Bar dataKey="ipIC50" name="IP IC50 (nM)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              )}
              {(selectedRoute === "all" || selectedRoute === "oral") && (
                <Bar dataKey="oralIC50" name="Oral IC50 (nM)" fill="#10b981" radius={[4, 4, 0, 0]} />
              )}
              {(selectedRoute === "all" || selectedRoute === "topical") && (
                <Bar dataKey="topicalIC50" name="Topical IC50 (nM)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
