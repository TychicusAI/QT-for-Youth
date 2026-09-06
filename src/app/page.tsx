import type { Metadata } from "next";
import { HomeContainer } from "@/components/HomeContainer";

export const metadata: Metadata = {
  title: "QT for Youth 青年靈修平台 | 每週深度研經・在日常中經歷復活大能",
  description: "專為青年基督徒打造的每日靈修平台。每週更新深度材料，陪伴青年在升學、職場與人際風浪中，拆毀自我信靠的焦慮，遇見那叫死人復活的神。"
};

export default function HomePage() {
  return <HomeContainer />;
}
