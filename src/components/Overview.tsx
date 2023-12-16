"use client";

import dayjs from "dayjs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type OverviewProps = {
  messageList: {
    createdAt: Date;
  }[];
};

export function Overview({ messageList }: OverviewProps) {
  function countMessagesByHour() {
    const counts: { [key: number]: number } = {};

    // Current time, 12 hours ago, and 1 hour ahead
    const now = dayjs();
    const startTime = now.subtract(12, "hour").startOf("hour");

    // Initialize counts for each hour
    for (let i = 0; i < 12; i++) {
      counts[i] = 0;
    }

    // Process each message
    messageList.forEach((message) => {
      const createdAt = dayjs(message.createdAt);
      if (createdAt.isAfter(startTime) && createdAt.isBefore(now)) {
        const hourDiff = createdAt.diff(startTime, "hour");
        counts[hourDiff]++;
      }
    });

    // Convert the counts to the desired format
    const result = [];
    for (let i = 0; i < 12; i++) {
      const hourLabel = startTime.add(i, "hour");
      const name = `${hourLabel.format("HH:mm")}`;
      result.push({
        name,
        total: counts[i],
      });
    }

    return result;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={countMessagesByHour()}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
