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
import ArrType_36 from "./ArrType_36"
import ArrType_37 from "./ArrType_37"
import ArrType_38 from "./ArrType_38"
import ArrType_39 from "./ArrType_39"
import ArrType_40 from "./ArrType_40"
import ArrType_41 from "./ArrType_41"
import ArrType_42 from "./ArrType_42"
import ArrType_43 from "./ArrType_43"
import ArrType_44 from "./ArrType_44"
import ArrType_45 from "./ArrType_45"
import ArrType_46 from "./ArrType_46"
import ArrType_47 from "./ArrType_47"
import ArrType_48 from "./ArrType_48"
import ArrType_49 from "./ArrType_49"
import ArrType_50 from "./ArrType_50"
import ArrType_51 from "./ArrType_51"
import ArrType_52 from "./ArrType_52"
import ArrType_53 from "./ArrType_53"
import ArrType_54 from "./ArrType_54"
import ArrType_55 from "./ArrType_55"
import ArrType_56 from "./ArrType_56"
import ArrType_57 from "./ArrType_57"
import ArrType_58 from "./ArrType_58"
import ArrType_59 from "./ArrType_59"
import ArrType_60 from "./ArrType_60"
import ArrType_61 from "./ArrType_61"
import ArrType_62 from "./ArrType_62"
import ArrType_63 from "./ArrType_63"
import ArrType_64 from "./ArrType_64"
import ArrType_65 from "./ArrType_65"
import ArrType_66 from "./ArrType_66"
import ArrType_67 from "./ArrType_67"
import ArrType_68 from "./ArrType_68"
import ArrType_69 from "./ArrType_69"
import ArrType_70 from "./ArrType_70"



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
        return provider(<ArrType_4 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
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

      case "type36": {
        return provider(<ArrType_36 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type37": {
        return provider(<ArrType_37 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type38": {
        return provider(<ArrType_38 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type39": {
        return provider(<ArrType_39 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type40": {
        return provider(<ArrType_40 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type41": {
        return provider(<ArrType_41 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type42": {
        return provider(<ArrType_42 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type43": {
        return provider(<ArrType_43 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type44": {
        return provider(<ArrType_44 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type45": {
        return provider(<ArrType_45 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type46": {
        return provider(<ArrType_46 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type47": {
        return provider(<ArrType_47 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type48": {
        return provider(<ArrType_48 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type49": {
        return provider(<ArrType_49 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type50": {
        return provider(<ArrType_50 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type51": {
        return provider(<ArrType_51 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type52": {
        return provider(<ArrType_52 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type53": {
        return provider(<ArrType_53 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type54": {
        return provider(<ArrType_54 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type55": {
        return provider(<ArrType_55 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type56": {
        return provider(<ArrType_56 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type57": {
        return provider(<ArrType_57 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type58": {
        return provider(<ArrType_58 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type59": {
        return provider(<ArrType_59 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type60": {
        return provider(<ArrType_60 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type61": {
        return provider(<ArrType_61 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type62": {
        return provider(<ArrType_62 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type63": {
        return provider(<ArrType_63 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type64": {
        return provider(<ArrType_64 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type65": {
        return provider(<ArrType_65 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type66": {
        return provider(<ArrType_66 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type67": {
        return provider(<ArrType_67 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type68": {
        return provider(<ArrType_68 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type69": {
        return provider(<ArrType_69 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }
      case "type70": {
        return provider(<ArrType_70 hint={q.metadata.hint} key={q.id} data={q.metadata.data ?? []} />)
      }


      default:
        return null
    }
  }, [q])
}