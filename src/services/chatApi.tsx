export const sendMessageToChatbot = async (
  message: string
): Promise<string> => {
  const response = await fetch("https://api.tpes.com.vn/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: "1",
      agent_id: "1",
      message,
      response: "",
      rate: 0,
      feedback: "",
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Lỗi khi gửi tin nhắn đến chatbot");
  }

  const data = await response.json();
  return data.message; // phản hồi từ bot
};
