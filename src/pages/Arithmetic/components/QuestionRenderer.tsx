import { useMemo } from "react"
import ArrType_1 from "./ArrType_1"
import ArrType_10 from "./ArrType_10"
import ArrType_11 from "./ArrType_11"
import ArrType_12 from "./ArrType_12"
import ArrType_13 from "./ArrType_13"
import ArrType_14 from "./ArrType_14"
import ArrType_15 from "./ArrType_15"
import ArrType_16 from "./ArrType_16"
import ArrType_17 from "./ArrType_17"
import ArrType_18 from "./ArrType_18"
import ArrType_19 from "./ArrType_19"
import ArrType_2 from "./ArrType_2"
import ArrType_20 from "./ArrType_20"
import ArrType_21 from "./ArrType_21"
import ArrType_22 from "./ArrType_22"
import ArrType_23 from "./ArrType_23"
import ArrType_24 from "./ArrType_24"
import ArrType_25 from "./ArrType_25"
import ArrType_26 from "./ArrType_26"
import ArrType_27 from "./ArrType_27"

import ArrType_3 from "./ArrType_3"
import ArrType_4 from "./ArrType_4"
import ArrType_5 from "./ArrType_5"
import ArrType_6 from "./ArrType_6"
import ArrType_7 from "./ArrType_7"
import ArrType_8 from "./ArrType_8"
import ArrType_9 from "./ArrType_9"

import ArrType_28 from "./ArrType_28"
import ArrType_29 from "./ArrType_29"
import ArrType_30 from "./ArrType_30"
import { QuestionMetaProvider } from "@/context/QuestionMetaContext"
import ArrType_31 from "./ArrType_31"
import ArrType_32 from "./ArrType_32"
import ArrType_33 from "./ArrType_33"
import ArrType_34 from "./ArrType_34"
import ArrType_35 from "./ArrType_35"


export default function QuestionRenderer({ q }: { q: any }) {
    return useMemo(() => {
        if (!q) return null

        const metaTitle = q?.metadata?.question ?? String(q?.type ?? q?.id)
        const provider = (child: React.ReactNode) => (
            <QuestionMetaProvider value={{ id: q.id, title: metaTitle }}>
                {child}
            </QuestionMetaProvider>
        )

        switch (q.type) {
            case "type1": {
                const { answer1, steps, count, defaultValue } = q.metadata
                return provider(
                    <ArrType_1
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
            case "type2_1": {
                const opts = q.metadata.options ?? []
                const presetLineNums = opts.map((lineNum: number, i: number) => ({
                    dotIndex: i,
                    lineNum,
                }))
                return provider(
                    <ArrType_2
                        hint={q.metadata.hint}
                        key={q.id}
                        mode={q.metadata?.mode}
                        presetLineNums={presetLineNums}
                        dotCount={opts.length}
                    />
                )
            }
            case "type2_2": {
                const opts = q.metadata.options ?? []
                return provider(
                    <ArrType_2
                        hint={q.metadata.hint}
                        key={q.id}
                        mode={q.metadata?.mode}
                        presetBoxNumbers={opts}
                        dotCount={opts.length}
                    />
                )
            }
            case "type3": {
                return provider(<ArrType_3 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
            }
            case "type4": {
                return provider(<ArrType_4  hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
            }
            case "type5_1": {
                return provider(
                    <ArrType_5
                        hint={q.metadata.hint}
                        key={q.id}
                        method={q.metadata.method}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type5_2": {
                return provider(
                    <ArrType_5
                        hint={q.metadata.hint}
                        key={q.id}
                        method={q.metadata.method}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type6_1": {
                return provider(
                    <ArrType_6
                        hint={q.metadata.hint}
                        key={q.id}
                        method={q.metadata.method}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type6_2": {
                return provider(
                    <ArrType_6
                        hint={q.metadata.hint}
                        key={q.id}
                        method={q.metadata.method}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type7": {
                return provider(
                    <ArrType_7
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type8": {
                return provider(
                    <ArrType_8
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type9": {
                return provider(
                    <ArrType_9
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type10": {
                return provider(
                    <ArrType_10
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type11": {
                return provider(
                    <ArrType_11
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type12": {
                return provider(
                    <ArrType_12
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type13_1": {
                return provider(
                    <ArrType_13
                        hint={q.metadata.hint}
                        key={q.id}
                        dataOne={q.metadata.data ?? []}
                    />
                )
            }
            case "type13_2": {
                return provider(
                    <ArrType_13
                        hint={q.metadata.hint}
                        key={q.id}
                        dataTwo={q.metadata.data ?? []}
                    />
                )
            }
            case "type14_1": {
                return provider(
                    <ArrType_14
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type14_2": {
                return provider(
                    <ArrType_14
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type15": {
                return provider(
                    <ArrType_15
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type16": {
                return provider(
                    <ArrType_16
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type17": {
                return provider(
                    <ArrType_17
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type18": {
                return provider(
                    <ArrType_18
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type19": {
                return provider(
                    <ArrType_19
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type20": {
                return provider(
                    <ArrType_20
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type21": {
                return provider(
                    <ArrType_21
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type22": {
                return provider(
                    <ArrType_22
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type23": {
                return provider(
                    <ArrType_23
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type24": {
                return provider(
                    <ArrType_24
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type25": {
                return provider(
                    <ArrType_25
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type26": {
                return provider(
                    <ArrType_26
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type27": {
                return provider(
                    <ArrType_27
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type28": {

                return provider(
                    <ArrType_28
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type29": {
                return provider(
                    <ArrType_29
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type30": {
                return provider(
                    <ArrType_30
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type31": {
                return provider(
                    <ArrType_31
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type32": {
                return provider(
                    <ArrType_32
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type33": {
                return provider(
                    <ArrType_33
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type34": {
                return provider(
                    <ArrType_34
                        hint={q.metadata.hint}
                        key={q.id}
                        data={q.metadata.data ?? []}
                    />
                )
            }
            case "type35": {
                return provider(
                    <ArrType_35
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
