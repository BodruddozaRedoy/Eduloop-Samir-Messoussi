export type MathPairsItem = { id: number; result: number; answer: [number, number][] }
export type MathOptionItem = { id: number; result: number; option: number; answer: number }
export type BetweenItem = { id: number; number: number; from: number; to: number }
export type PrevNextItem = { id: number; number: number; firstNumber: number; lastNumber: number }

export type FillBlankQuestion = {
  id: number
  type: 'fill_blank'
  group: string
  subject: string
  category: string
  level: string
  metadata: {
    question: string
    steps: number
    answer1: number
    count: number
    defaultValue: number
    hint: string
  }
}

export type Scale1Question = {
  id: number
  type: 'scale1'
  group: string
  subject: string
  category: string
  level: string
  metadata: {
    question: string
    options: number[]
    hint: string
  }
}

export type Scale2Question = {
  id: number
  type: 'scale2'
  group: string
  subject: string
  category: string
  level: string
  metadata: {
    question: string
    options: number[]
    hint: string
  }
}

export type Math4Question = {
  id: number
  type: 'math4'
  group: string
  subject: string
  category: string
  level: string
  metadata: {
    question: string
    data: BetweenItem[]
    hint: string
  }
}

export type Math5Question = {
  id: number
  type: 'math5'
  group: string
  subject: string
  category: string
  level: string
  metadata: {
    question: string
    data: PrevNextItem[]
    hint: string
  }
}

export type  Math6Question = {
  id: number
  type: 'math6'
  group: string
  subject: string
  category: string
  level: string
  metadata: {
    question: string
    method: 'addition'
    data: MathOptionItem[]
    hint: string
  }
}

export type  Math7Question = {
  id: number
  type: 'math7'
  group: string
  subject: string
  category: string
  level: string
  metadata: {
    question: string
    method: 'multiplication'
    data: MathOptionItem[]
    hint: string
  }
}

export type  Math8Question = {
  id: number
  type: 'math8'
  group: string
  subject: string
  category: string
  level: string
  metadata: {
    question: string
    method: 'addition'
    data: MathPairsItem[]
    hint: string
  }
}

export type  Math9Question = {
  id: number
  type: 'math9'
  group: string
  subject: string
  category: string
  level: string
  metadata: {
    question: string
    method: 'multiplication'
    data: MathPairsItem[]
    hint: string
  }
}

// Generic questions for additional math types rendered by QuestionRenderer
// These share a common metadata shape: { question, data, hint }
export type Math10To23Type =
  | 'math10'
  | 'math11'
  | 'math12'
  | 'math13'
  | 'math14'
  | 'math15'
  | 'math16'
  | 'math17'
  | 'math18'
  | 'math19'
  | 'math20'
  | 'math21'
  | 'math22'
  | 'math23'

export type GenericMathQuestion = {
  id: number
  type: Math10To23Type
  group: string
  subject: string
  category: string
  level: string
  metadata: {
    question: string
    // The concrete structure varies by component; keep it flexible
    data: unknown[]
    hint: string
  }
}

export type Question =
  | FillBlankQuestion
  | Scale1Question
  | Scale2Question
  | Math4Question
  | Math5Question
  | Math6Question
  | Math7Question
  | Math8Question
  | Math9Question
  | GenericMathQuestion

