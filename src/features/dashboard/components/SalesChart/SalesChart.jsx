import "./SalesChart.css";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { FiTrendingUp } from "react-icons/fi";

import { salesChartData } from "../../mocks/dashboardData";

function SalesChart() {
  return (
    <section className="salesChart">
      <div className="salesChart__header">
        <div className="salesChart__title">
          <FiTrendingUp />

          <div>
            <h2>Vendas Mensais</h2>
            <p>Últimos 7 meses</p>
          </div>
        </div>
      </div>

      <div className="salesChart__content">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={salesChartData}>
            <defs>
              <linearGradient
                id="salesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#3B82F6"
                  stopOpacity={0.45}
                />

                <stop
                  offset="95%"
                  stopColor="#3B82F6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#2A3442"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="mes"
              tick={{ fill: "#94A3B8", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#94A3B8", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#141A22",
                border: "1px solid #313D50",
                borderRadius: "12px",
                color: "#F4F7FA",
              }}
              formatter={(value) =>
                value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }
            />

            <Area
              type="monotone"
              dataKey="vendas"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default SalesChart;