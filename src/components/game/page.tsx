import {
  couplesQuestions,
  friendsQuestions,
  partyQuestions,
  specialCouplesQuestions,
} from "@/data/questions";
import { Badge, Button, Card, CardContent, IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { LuHistory, LuRefreshCw } from "react-icons/lu";
import { format } from "date-fns";
import { FaTimes } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";

interface GameScreenProps {
  mode: "friends" | "couples" | "party" | "special";
  players: string[];
  onBack: () => void;
}

type QuestionType = "truth" | "dare";

// Định nghĩa kiểu dữ liệu cho lịch sử câu hỏi
interface QuestionHistory {
  playerName: string;
  questionType: QuestionType;
  questionText: string;
  timestamp: Date;
}
export default function GameScreen({ mode, players, onBack }: GameScreenProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [questionType, setQuestionType] = useState<QuestionType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());

  const [isRevealing, setIsRevealing] = useState(false);

  // Thêm state để lưu lịch sử câu hỏi
  const [questionHistory, setQuestionHistory] = useState<QuestionHistory[]>([]);
  // Thêm state để hiển thị/ẩn panel lịch sử
  const [showHistory, setShowHistory] = useState(false);

  const getQuestions = () => {
    switch (mode) {
      case "friends":
        return friendsQuestions;
      case "couples":
        return couplesQuestions;
      case "party":
        return partyQuestions;
      case "special":
        return specialCouplesQuestions;
    }
  };

  const getRandomQuestion = (type: QuestionType) => {
    const questions = getQuestions()[type];
    const availableQuestions = questions.filter((q) => !usedQuestions.has(q));

    // If we've used all questions, reset the used questions
    if (availableQuestions.length === 0) {
      setUsedQuestions(new Set());
      return questions[Math.floor(Math.random() * questions.length)];
    }

    const randomQuestion =
      availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setUsedQuestions(new Set([...usedQuestions, randomQuestion]));
    return randomQuestion;
  };

  const selectQuestionType = (type: QuestionType) => {
    setQuestionType(type);
    setIsRevealing(true);
    setTimeout(() => {
      const question = getRandomQuestion(type);
      setCurrentQuestion(question);
      setIsRevealing(false);
    }, 1000);

    // Add a small delay before showing the question for a reveal effect
  };

  const nextTurn = () => {
    // Lưu câu hỏi hiện tại vào lịch sử trước khi chuyển lượt
    if (questionType && currentQuestion) {
      const historyItem: QuestionHistory = {
        playerName: players[currentPlayerIndex],
        questionType: questionType,
        questionText: currentQuestion,
        timestamp: new Date(),
      };

      setQuestionHistory((prev) => [...prev, historyItem]);
    }

    setQuestionType(null);
    setCurrentQuestion(null);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  const clearHistory = useCallback(() => {
    setQuestionHistory([]);
  }, []);

  const getModeColor = () => {
    switch (mode) {
      case "friends":
        return "from-purple-600 to-blue-600";
      case "couples":
        return "from-pink-500 to-purple-600";
      case "party":
        return "from-blue-600 to-purple-600";
      case "special":
        return "from-rose-500 to-purple-600";
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case "friends":
        return "Bạn bè";
      case "couples":
        return "Cặp đôi";
      case "party":
        return "Buổi tiệc";
      case "special":
        return "Cặp đôi đặc biệt";
    }
  };

  return (
    <Card className="w-full max-w-md bg-white p-3 shadow-lg relative">
      <div className="flex items-center justify-between">
        <IconButton onClick={onBack} className="!text-black">
          <IoHomeOutline className="h-5 w-5" />
        </IconButton>
        <div className="flex items-center gap-2">
          {/* Thêm nút hiển thị lịch sử */}
          <Button
            onClick={toggleHistory}
            className="relative flex h-10 w-10 items-center hover:text-primary !min-w-auto hover:!bg-purple-50 !text-black !rounded-full"
          >
            <LuHistory className="h-5 w-5" />
            {questionHistory.length > 0 && (
              // <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 text-xs">
              //   {questionHistory.length}
              // </Badge>

              <span className="absolute right-0 top-[4px] flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex h-4 w-4 rounded-full bg-purple-500 text-white text-xs items-center justify-center">
                  {questionHistory.length}
                </span>
              </span>
            )}
          </Button>
          <div className="rounded-xl bg-purple-100 p-1">
            <h2 className={`text-sm font-normal text-purple-800`}>
              {getModeTitle()}
            </h2>
          </div>
        </div>
      </div>

      {!questionType ? (
        <h2
          className={`bg-gradient-to-r ${getModeColor()} bg-clip-text text-xl md:text-2xl lg:text-3xl font-bold text-transparent text-center mt-4`}
        >
          Thật hay Thách
        </h2>
      ) : null}

      <CardContent className="p-6 !pb-3">
        <AnimatePresence mode="wait">
          {!questionType ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div
                className="rounded-lg bg-gray-100 p-4 text-center"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <p className="text-sm text-gray-500">Lượt của</p>
                <p className="text-xl font-bold text-gray-800">
                  {players[currentPlayerIndex]}
                </p>
              </motion.div>

              <motion.p
                className="text-center text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Bạn chọn gì?
              </motion.p>

              <motion.div
                className="flex items-center justify-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  className="!bg-blue-500 py-8 text-lg font-medium hover:!bg-blue-600 !text-white w-fit !rounded-lg"
                  onClick={() => selectQuestionType("truth")}
                >
                  Thật
                </Button>
                <Button
                  className="!bg-orange-400 py-8 text-lg font-medium hover:!bg-orange-600 !text-white w-fit !rounded-lg"
                  onClick={() => selectQuestionType("dare")}
                >
                  Thách
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 p-6"
            >
              <motion.div
                className="rounded-lg bg-gray-100 p-4 text-center"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <p className="text-sm text-gray-500">Lượt của</p>
                <p className="text-xl font-bold text-gray-800">
                  {players[currentPlayerIndex]}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-600">
                  Đã chọn:{" "}
                  <span
                    className={
                      questionType === "truth"
                        ? "text-blue-600"
                        : "text-purple-600"
                    }
                  >
                    {questionType === "truth" ? "Thật" : "Thách"}
                  </span>
                </p>
              </motion.div>

              <AnimatePresence>
                {isRevealing ? (
                  <motion.div
                    key="revealing"
                    className={`flex h-32 items-center justify-center rounded-lg border-2 ${
                      questionType === "truth"
                        ? "border-blue-200 bg-blue-50"
                        : "border-purple-200 bg-purple-50"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    >
                      <LuRefreshCw
                        className={`h-10 w-10 ${
                          questionType === "truth"
                            ? "text-blue-400"
                            : "text-purple-400"
                        }`}
                      />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="question-revealed"
                    className={`rounded-lg border-2 ${
                      questionType === "truth"
                        ? "border-blue-200 bg-blue-50"
                        : "border-purple-200 bg-purple-50"
                    } p-6 text-center`}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <p className="text-lg font-medium text-gray-800">
                      {currentQuestion}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  className={`w-full !text-white ${
                    questionType === "truth"
                      ? "!bg-blue-600 hover:!bg-blue-700"
                      : "!bg-purple-600 hover:!bg-purple-700"
                  }`}
                  onClick={nextTurn}
                  disabled={isRevealing}
                >
                  Lượt tiếp theo
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      {/* Panel lịch sử câu hỏi */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col bg-white"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-b-gray-300 p-4">
              <h3 className="text-lg font-semibold">Lịch sử câu hỏi</h3>
              <div className="flex gap-2">
                {questionHistory.length > 0 && (
                  <Button
                    variant="outlined"
                    onClick={clearHistory}
                    className="!text-xs !text-black !border-gray-300 hover:!bg-gray-100"
                  >
                    Xóa lịch sử
                  </Button>
                )}

                <IconButton
                  onClick={toggleHistory}
                  className="flex-shrink-0 !min-w-auto !text-black"
                >
                  <FaTimes className="text-sm" />
                </IconButton>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-auto">
              {questionHistory.length === 0 ? (
                <p className="text-center text-gray-500">Chưa có câu hỏi nào</p>
              ) : (
                <div className="space-y-4">
                  {questionHistory.map((item, index) => (
                    <motion.div
                      key={index}
                      className="rounded-lg border p-3 border-gray-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              item.questionType === "truth"
                                ? "!bg-blue-500 text-white rounded-sm text-sm p-1"
                                : "!bg-orange-500 text-white rounded-sm text-sm p-1"
                            }
                          >
                            {item.questionType === "truth" ? "Thật" : "Thách"}
                          </Badge>
                          <span className="font-medium">{item.playerName}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(item.timestamp), "hh:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {item.questionText}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
