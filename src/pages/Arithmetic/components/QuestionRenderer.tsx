import { useMemo } from "react"
import ArrTypeOne from "./ArrTypeOne"
import ArrTypeTwo from "./ArrTypeTwo"
import ArrTypeThree from "./ArrTypeThree"
import ArrTypeFour from "./ArrTypeFour"
import ArrTypeFive from "./ArrTypeFive"
import ArrTypeSix from "./ArrTypeSix"
import type { Question } from "@/types/ArithmeticType"
import ArrTypeSeven from "./ArrTypeSeven"
import ArrTypeEight from "./ArrTypeEight"
import ArrTypeNine from "./ArrTypeNine"
import ArrTypeTen from "./ArrTypeTen"
import ArrTypeEleven from "./ArrTypeEleven"
import ArrTypeTwelve from "./ArrTypeTwelve"
import ArrTypeThirteen from "./ArrTypeThirteen"
import ArrTypeFourteen from "./ArrTypeFourteen"
import ArrTypeFifteen from "./ArrTypeFifteen"
import ArrTypeSixteen from "./ArrTypeSixteen"
import ArrTypeSeventeen from "./ArrTypeSeventeen"
import ArrTypeEighteen from "./ArrTypeEighteen"
import ArrTypeNineteen from "./ArrTypeNineteen"
import ArrTypeTwenty from "./ArrTypeTwenty"

export default function QuestionRenderer({ q }: { q: Question }) {
    return useMemo(() => {
        if (!q) return null

        switch (q.type) {
            case "fill_blank": {
                const { answer1, steps, count, defaultValue } = q.metadata
                return (
                    <ArrTypeOne
                        key={q.id}
                        hint={q.metadata.hint}
                        rows={[
                            {
                                start: answer1 ?? 10,
                                step: steps ?? 10,
                                maxLength: count ?? 10,
                                prefilledCount: defaultValue ?? 2,
                                inputMaxLength: 3,
                            },
                        ]}
                    />
                )
            }
            case "scale1": {
                const opts = q.metadata.options ?? []
                const presetLineNums = opts.map((lineNum: number, i: number) => ({
                    dotIndex: i,
                    lineNum,
                }))
                return (
                    <ArrTypeTwo
                        hint={q.metadata.hint}
                        key={q.id}
                        mode="preConnected"
                        presetLineNums={presetLineNums}
                        dotCount={opts.length}
                    />
                )
            }
            case "scale2": {
                const opts = q.metadata.options ?? []
                return (
                    <ArrTypeTwo
                        hint={q.metadata.hint}
                        key={q.id}
                        mode="preFilledBoxes"
                        presetBoxNumbers={opts}
                        dotCount={opts.length}
                    />
                )
            }
            case "math4": {
                return <ArrTypeThree hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />
            }
            case "math5": {
                return <ArrTypeFour hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />
            }
            case "math6": {
                return (
                    <ArrTypeFive
                        hint={q.metadata.hint}
                        key={q.id}
                        method="addition"
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math7": {
                return (
                    <ArrTypeFive
                        hint={q.metadata.hint}
                        key={q.id}
                        method="multiplication"
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math8": {
                return (
                    <ArrTypeSix
                        hint={q.metadata.hint}
                        key={q.id}
                        method="addition"
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math9": {
                return (
                    <ArrTypeSix
                        hint={q.metadata.hint}
                        key={q.id}
                        method="multiplication"
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math10": {
                return (
                    <ArrTypeSeven
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math11": {
                return (
                    <ArrTypeEight
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math12": {
                return (
                    <ArrTypeNine
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math13": {
                return (
                    <ArrTypeTen
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math14": {
                return (
                    <ArrTypeEleven
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math15": {
                return (
                    <ArrTypeTwelve
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math16": {
                return (
                    <ArrTypeThirteen
                        hint={q.metadata.hint}
                        key={q.id}
                        dataOne={q.metadata.data ?? []}
                    />
                )
            }
            case "math16_2": {
                return (
                    <ArrTypeThirteen
                        hint={q.metadata.hint}
                        key={q.id}
                        dataTwo={q.metadata.data ?? []}
                    />
                )
            }
            case "math17": {
                return (
                    <ArrTypeFourteen
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math18": {
                return (
                    <ArrTypeFifteen
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math19": {
                return (
                    <ArrTypeSixteen
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math20": {
                return (
                    <ArrTypeSeventeen
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math21": {
                return (
                    <ArrTypeEighteen
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "math22": {
                return (
                    <ArrTypeNineteen
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                ) 
            }
            case "math23": {
                return (
                    <ArrTypeTwenty
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }

            default:
                return null
        }
    }, [q])
}
