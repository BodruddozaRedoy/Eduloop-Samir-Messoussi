import type { Question } from "@/types/ArithmeticType";

export const QUESTIONS_DATA: any[] = [
  {
    id: 17,
    type: "math17",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Medium",
    metadata: {
      question: "What time is it?",
      data: [
        {
          id: 1,
          boxTime: { hour: 4, minute: 0 }, // Fixed box time
          difference: 8, // 8 hours later
          correct: { hour: 12, minute: 0 }, // User must set 12 o'clock
        },
        {
          id: 2,
          boxTime: { hour: 4, minute: 0 }, // Fixed box time
          difference: 8, // 8 hours later
          correct: { hour: 12, minute: 0 }, // User must set 12 o'clock
        },
      ],
      hint: "Count the hours forward from the clock time until you reach the given time.",
    },
  },
  {
    id: 16,
    type: "math16_2",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Medium",
    metadata: {
      question: "What time is it?",
      data: [
        {
          id: 1,
          boxTime: { hour: 4, minute: 0 }, // Fixed box time
          difference: 8, // 8 hours later
          correct: { hour: 12, minute: 0 }, // User must set 12 o'clock
        },
        {
          id: 2,
          boxTime: { hour: 4, minute: 0 }, // Fixed box time
          difference: 8, // 8 hours later
          correct: { hour: 12, minute: 0 }, // User must set 12 o'clock
        },
      ],
      hint: "Count the hours forward from the clock time until you reach the given time.",
    },
  },
  {
    id: 15,
    type: "math16",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Medium",
    metadata: {
      question: "How many hours later?",
      data: [
        {
          id: 1,
          clock: { hour: 9, minute: 0 },
          boxTime: { hour: 12, minute: 0 },
          answer: 3,
        },
        {
          id: 2,
          clock: { hour: 5, minute: 0 },
          boxTime: { hour: 2, minute: 0 },
          answer: 9,
        },
      ],
      hint: "Count the hours forward from the clock time until you reach the given time.",
    },
  },
  {
    id: 14,
    type: "math15",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Medium",
    metadata: {
      question: "What time is it?",
      data: [
        {
          id: 1,
          clocks: [
            { value: { hour: 7, minute: 0 }, correct: { hour: 7, minute: 0 } },
            { user: true, correct: { hour: 8, minute: 0 } },
            { value: { hour: 9, minute: 0 }, correct: { hour: 9, minute: 0 } },
          ],
        },
        {
          id: 2,
          clocks: [
            { value: { hour: 3, minute: 0 }, correct: { hour: 3, minute: 0 } },
            { user: true, correct: { hour: 4, minute: 0 } },
            { value: { hour: 5, minute: 0 }, correct: { hour: 5, minute: 0 } },
          ],
        },
      ],
      hint: "Look at the pattern of hours. The missing clock should be between the given ones.",
    },
  },
  {
    id: 13,
    type: "math14",
    group: "4",
    subject: "Arithmetic",
    category: "Advance",
    level: "Easy",
    metadata: {
      question: "Which sums are associated with it?",
      data: [
        {
          id: 1,
          top: 5,
          bottoms: [2, null],
          answers: ["2 + 3 = 5", "3 + 2 = 5", "5 - 2 = 3", "5 - 3 = 2"],
        },
        {
          id: 2,
          top: 7,
          bottoms: [2, 5],
          answers: ["2 + 5 = 7", "5 + 2 = 7", "7 - 2 = 5", "7 - 5 = 2"],
        },
        {
          id: 3,
          bottoms: [4, 5],
          top: null,
          answers: ["4 + 5 = 9", "5 + 4 = 9", "9 - 4 = 5", "9 - 5 = 4"],
        },
        {
          id: 4,
          top: 8,
          bottoms: [2, 6],
          answers: ["2 + 6 = 8", "6 + 2 = 8", "8 - 2 = 6", "8 - 6 = 2"],
        },
      ],
      hint: "Only find those numbers sum, that is matched with the box numbers.",
    },
  },
  {
    id: 12,
    type: "math13",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Easy",
    metadata: {
      question: "Which sums are associated with it?",
      data: [
        { id: 1, question: "5 - 3 =", answer: 2, type: "subtraction" },
        { id: 2, question: "7 - 3 =", answer: 4, type: "subtraction" },
        { id: 3, question: "8 - 6 =", answer: 2, type: "subtraction" },
        { id: 4, question: "6 - 4 =", answer: 2, type: "subtraction" },
        { id: 5, question: "8 - 4 =", answer: 4, type: "subtraction" },
        { id: 6, question: "9 - 6 =", answer: 3, type: "subtraction" },
        { id: 7, question: "9 - 3 =", answer: 6, type: "subtraction" },
        { id: 8, question: "6 - 3 =", answer: 3, type: "subtraction" },
        { id: 9, question: "7 - 3 =", answer: 4, type: "subtraction" },
        { id: 10, question: "9 - 7 =", answer: 2, type: "subtraction" },
      ],
      hint: "Try counting the dots on the abacus for each number to find the answer.",
    },
  },
  {
    id: 11,
    type: "math12",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Easy",
    metadata: {
      question: "Make splits with the numbers Consider 3 sums for each split",

      data: {
        numbers: [8, 2, 6, 9, 5, 4, 10, 6, 4], //these number will be the reference numbers of the data numbers
        query: [
          {
            id: 1,
            top: 8,
            bottoms: [2, 6],
            answers: ["2 + 6 = 8", "6 + 2 = 8", "8 - 2 = 6", "8 - 6 = 2"],
          },
          {
            id: 2,
            top: 9,
            bottoms: [5, 4],
            answers: ["5 + 4 = 9", "4 + 5 = 9", "9 - 5 = 4", "9 - 4 = 5"],
          },
          {
            id: 3,
            top: 10,
            bottoms: [6, 4],
            answers: ["4 + 6 = 10", "6 + 4 = 10", "10 - 4 = 6", "10 - 6 = 4"],
          },
        ],
      },
      hint: "Only find those numbers sum, that is matched with the box numbers.",
    },
  },
  {
    id: 10,
    type: "math11",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Easy",
    metadata: {
      question: "Which sums are associated with it?",
      data: [
        {
          id: 1,
          numbers: [5, 2, 3],
          answers: [
            { a: 2, op: "+", b: 3, result: 5 },
            { a: 3, op: "+", b: 2, result: 5 },
            { a: 5, op: "-", b: 2, result: 3 },
            { a: 5, op: "-", b: 3, result: 2 },
          ],
        },
        {
          id: 2,
          numbers: [],
          answers: [
            { a: 4, op: "+", b: 2, result: 6 },
            { a: 2, op: "+", b: 4, result: 6 },
            { a: 6, op: "-", b: 4, result: 2 },
            { a: 6, op: "-", b: 2, result: 4 },
          ],
        },
        {
          id: 3,
          numbers: [9, 7, 2],
          answers: [
            { a: 7, op: "+", b: 2, result: 9 },
            { a: 2, op: "+", b: 7, result: 9 },
            { a: 9, op: "-", b: 7, result: 2 },
            { a: 9, op: "-", b: 2, result: 7 },
          ],
        },
        {
          id: 4,
          numbers: [8, 5, 3],
          answers: [
            { a: 5, op: "+", b: 3, result: 8 },
            { a: 3, op: "+", b: 5, result: 8 },
            { a: 8, op: "-", b: 5, result: 3 },
            { a: 8, op: "-", b: 3, result: 5 },
          ],
        },
      ],
      hint: "Make addition and subtraction using those 3 numbers in the boxes.",
    },
  },
  {
    id: 9,
    type: "math10",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Easy",
    metadata: {
      question: "Which sums are associated with it?",
      data: [
        {
          id: 1,
          digits: [6, 4, 2],
          pattern: ["6 - 4 = 2", "6 - 3 = 3", "3 + 3 = 6", "4 + 2 = 6"],
          answer: ["6 - 4 = 2", "4 + 2 = 6"],
        },
        {
          id: 2,
          digits: [8, 5, 3],
          pattern: ["8 - 5 = 3", "5 + 3 = 8", "8 - 4 = 4", "2 + 5 = 8"],
          answer: ["8 - 5 = 3", "5 + 3 = 8"],
        },
        {
          id: 3,
          digits: [9, 6, 3],
          pattern: ["9 - 6 = 3", "6 + 3 = 9", "9 - 5 = 4", "4 + 4 = 9"],
          answer: ["9 - 6 = 3", "6 + 3 = 9"],
        },
      ],
      hint: "Only find those numbers sum, that is matched with the box numbers.",
    },
  },

  {
    id: 7,
    type: "math8",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Easy",
    metadata: {
      question: "Guess the numbers that is addition of the top number",
      method: "addition",
      data: [
        {
          id: 1,
          result: 10,
          answer: [
            [5, 5],
            [8, 2],
            [6, 4],
          ],
        },
        {
          id: 2,
          result: 20,
          answer: [
            [10, 10],
            [18, 2],
            [15, 5],
          ],
        },
        {
          id: 3,
          result: 50,
          answer: [
            [25, 25],
            [30, 20],
            [42, 8],
          ],
        },
        {
          id: 4,
          result: 60,
          answer: [
            [30, 30],
            [40, 20],
            [49, 11],
          ],
        },
      ],
      hint: "Follow this: 5 + ? = 10, 8 + ? = 10, 6 + ? = 10",
    },
  },
  // {
  //   id: 7,
  //   type: "math7",
  //   group: "4",
  //   subject: "Arithmetic",
  //   category: "Basic",
  //   level: "Easy",
  //   metadata: {
  //     question: "Guess the number that is multiplication of the top number",
  //     method: "multiplication",
  //     data: [
  //       { id: 1, result: 10, option: 2, answer: 8 },
  //       { id: 2, result: 20, option: 10, answer: 10 },
  //       { id: 3, result: 50, option: 25, answer: 25 },
  //       { id: 4, result: 60, option: 20, answer: 15 },
  //     ],
  //     hint: "Follow this: 2 * ? = 10",
  //   },
  // },
  {
    id: 6,
    type: "math6",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Easy",
    metadata: {
      question: "Guess the number that is addition of the top number",
      method: "addition",
      data: [
        { id: 1, result: 10, option: 2, answer: 8 },
        { id: 2, result: 20, option: 10, answer: 10 },
        { id: 3, result: 50, option: 25, answer: 25 },
        { id: 4, result: 35, option: 20, answer: 15 },
      ],
      hint: "Follow this: 2 + ? = 10",
    },
  },
  {
    id: 5,
    type: "math5",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Easy",
    metadata: {
      question: "Guess the previous number and next number.",
      data: [
        { id: 1, number: 18, firstNumber: 17, lastNumber: 19 },
        { id: 2, number: 45, firstNumber: 44, lastNumber: 46 },
        { id: 3, number: 69, firstNumber: 68, lastNumber: 70 },
      ],
      hint: "Follow this: ? 18 ?. What is the number of previous number and next number?",
    },
  },
  {
    id: 4,
    type: "math4",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Easy",
    metadata: {
      question: "Between which number?",
      data: [
        { id: 1, number: 10, from: 1, to: 15 },
        { id: 2, number: 20, from: 19, to: 29 },
        { id: 3, number: 30, from: 30, to: 39 },
        { id: 4, number: 40, from: 39, to: 49 },
        { id: 5, number: 50, from: 49, to: 69 },
      ],
      hint: "Match the number withing the range numbers.",
    },
  },
  {
    id: 3,
    type: "scale2",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Advance",
    metadata: {
      question:
        "Which numbers are there in this boxes? Connect with the scale line.",
      options: [12, 50, 34, 43, 63, 89],
      hint: "Just count 1 by 1 of the scale line and connect with the scale line",
    },
  },
  {
    id: 2,
    type: "scale1",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Medium",
    metadata: {
      question: "Which numbers are there in this scale?",
      options: [12, 50, 34, 43, 63, 89, 99, 100, 43],
      hint: "Just count 1 by 1 of the scale line and type at the boxes",
    },
  },
  {
    id: 1,
    type: "fill_blank",
    group: "4",
    subject: "Arithmetic",
    category: "Basic",
    level: "Easy",
    metadata: {
      question: "Continue counting in jumps of 10.",
      steps: 10,
      answer1: 12,
      count: 10,
      defaultValue: 3,
      hint: "Just add 10 with every number",
    },
  },
];
