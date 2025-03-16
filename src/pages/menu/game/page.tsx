import {
  couplesQuestions,
  friendsQuestions,
  partyQuestions,
} from "@/data/questions";
import { Button, Card, CardContent, IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { LuCircleArrowLeft, LuRefreshCw } from "react-icons/lu";

interface GameScreenProps {
  mode: "friends" | "couples" | "party";
  players: string[];
  onBack: () => void;
}

type QuestionType = "truth" | "dare";
export default function GameScreen({ mode, players, onBack }: GameScreenProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [questionType, setQuestionType] = useState<QuestionType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());

  const [isRevealing, setIsRevealing] = useState(false);

  const getQuestions = () => {
    switch (mode) {
      case "friends":
        return friendsQuestions;
      case "couples":
        return couplesQuestions;
      case "party":
        return partyQuestions;
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
    setQuestionType(null);
    setCurrentQuestion(null);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  const getModeColor = () => {
    switch (mode) {
      case "friends":
        return "from-purple-600 to-blue-600";
      case "couples":
        return "from-pink-500 to-purple-600";
      case "party":
        return "from-blue-600 to-purple-600";
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case "friends":
        return "Chế độ Bạn bè";
      case "couples":
        return "Chế độ Cặp đôi";
      case "party":
        return "Chế độ Buổi tiệc";
    }
  };

  return (
    <Card className="w-full max-w-md bg-white p-6 shadow-lg">
      <div className="flex items-center">
        <IconButton onClick={onBack}>
          <LuCircleArrowLeft className="h-5 w-5" />
        </IconButton>
        <h2
          className={`bg-gradient-to-r ${getModeColor()} bg-clip-text text-2xl font-bold text-transparent`}
        >
          {getModeTitle()}
        </h2>
      </div>

      <CardContent className="p-6">
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
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  className="!bg-blue-500 py-8 text-lg font-medium hover:!bg-blue-600 !text-white"
                  onClick={() => selectQuestionType("truth")}
                >
                  Truth
                </Button>
                <Button
                  className="!bg-orange-400 py-8 text-lg font-medium hover:!bg-orange-600 !text-white"
                  onClick={() => selectQuestionType("dare")}
                >
                  Dare
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="question"
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
                <p className="mt-1 text-sm font-medium text-gray-600">
                  Đã chọn:{" "}
                  <span
                    className={
                      questionType === "truth"
                        ? "text-blue-600"
                        : "text-purple-600"
                    }
                  >
                    {questionType === "truth" ? "Truth" : "Dare"}
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
                >
                  Lượt tiếp theo
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
