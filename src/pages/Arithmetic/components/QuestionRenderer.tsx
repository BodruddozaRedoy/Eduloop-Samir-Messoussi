import LoadingScreen from "@/components/common/LoadingScreen";
import { QuestionMetaProvider } from "@/context/QuestionMetaContext";
import { lazy, Suspense, useMemo } from "react"
const ArrType_1 = lazy(() => import("./ArrType_1"));
const ArrType_2 = lazy(() => import("./ArrType_2"));
const ArrType_3 = lazy(() => import("./ArrType_3"));
const ArrType_4 = lazy(() => import("./ArrType_4"));
const ArrType_5 = lazy(() => import("./ArrType_5"));
const ArrType_6 = lazy(() => import("./ArrType_6"));
const ArrType_7 = lazy(() => import("./ArrType_7"));
const ArrType_8 = lazy(() => import("./ArrType_8"));
const ArrType_9 = lazy(() => import("./ArrType_9"));
const ArrType_10 = lazy(() => import("./ArrType_10"));
const ArrType_11 = lazy(() => import("./ArrType_11"));
const ArrType_12 = lazy(() => import("./ArrType_12"));
const ArrType_13 = lazy(() => import("./ArrType_13"));
const ArrType_14 = lazy(() => import("./ArrType_14"));
const ArrType_15 = lazy(() => import("./ArrType_15"));
const ArrType_16 = lazy(() => import("./ArrType_16"));
const ArrType_17 = lazy(() => import("./ArrType_17"));
const ArrType_18 = lazy(() => import("./ArrType_18"));
const ArrType_19 = lazy(() => import("./ArrType_19"));
const ArrType_20 = lazy(() => import("./ArrType_20"));
const ArrType_21 = lazy(() => import("./ArrType_21"));
const ArrType_22 = lazy(() => import("./ArrType_22"));
const ArrType_23 = lazy(() => import("./ArrType_23"));
const ArrType_24 = lazy(() => import("./ArrType_24"));
const ArrType_25 = lazy(() => import("./ArrType_25"));
const ArrType_26 = lazy(() => import("./ArrType_26"));
const ArrType_27 = lazy(() => import("./ArrType_27"));
const ArrType_28 = lazy(() => import("./ArrType_28"));
const ArrType_29 = lazy(() => import("./ArrType_29"));
const ArrType_30 = lazy(() => import("./ArrType_30"));
const ArrType_31 = lazy(() => import("./ArrType_31"));
const ArrType_32 = lazy(() => import("./ArrType_32"));
const ArrType_33 = lazy(() => import("./ArrType_33"));
const ArrType_34 = lazy(() => import("./ArrType_34"));
const ArrType_35 = lazy(() => import("./ArrType_35"));
const ArrType_36 = lazy(() => import("./ArrType_36"));
const ArrType_37 = lazy(() => import("./ArrType_37"));
const ArrType_38 = lazy(() => import("./ArrType_38"));
const ArrType_39 = lazy(() => import("./ArrType_39"));
const ArrType_40 = lazy(() => import("./ArrType_40"));
const ArrType_41 = lazy(() => import("./ArrType_41"));
const ArrType_42 = lazy(() => import("./ArrType_42"));
const ArrType_43 = lazy(() => import("./ArrType_43"));
const ArrType_44 = lazy(() => import("./ArrType_44"));
const ArrType_45 = lazy(() => import("./ArrType_45"));
const ArrType_46 = lazy(() => import("./ArrType_46"));
const ArrType_47 = lazy(() => import("./ArrType_47"));
const ArrType_48 = lazy(() => import("./ArrType_48"));
const ArrType_49 = lazy(() => import("./ArrType_49"));
const ArrType_50 = lazy(() => import("./ArrType_50"));
const ArrType_51 = lazy(() => import("./ArrType_51"));
const ArrType_52 = lazy(() => import("./ArrType_52"));
const ArrType_53 = lazy(() => import("./ArrType_53"));
const ArrType_54 = lazy(() => import("./ArrType_54"));
const ArrType_55 = lazy(() => import("./ArrType_55"));
const ArrType_56 = lazy(() => import("./ArrType_56"));
const ArrType_57 = lazy(() => import("./ArrType_57"));
const ArrType_58 = lazy(() => import("./ArrType_58"));
const ArrType_59 = lazy(() => import("./ArrType_59"));
const ArrType_60 = lazy(() => import("./ArrType_60"));
const ArrType_61 = lazy(() => import("./ArrType_61"));
const ArrType_62 = lazy(() => import("./ArrType_62"));
const ArrType_63 = lazy(() => import("./ArrType_63"));
const ArrType_64 = lazy(() => import("./ArrType_64"));
const ArrType_65 = lazy(() => import("./ArrType_65"));
const ArrType_66 = lazy(() => import("./ArrType_66"));
const ArrType_67 = lazy(() => import("./ArrType_67"));
const ArrType_68 = lazy(() => import("./ArrType_68"));
const ArrType_69 = lazy(() => import("./ArrType_69"));
const ArrType_70 = lazy(() => import("./ArrType_70"));
const ArrType_71 = lazy(() => import("./ArrType_71"));
const ArrType_72 = lazy(() => import("./ArrType_72"));
const ArrType_73 = lazy(() => import("./ArrType_73"));
const ArrType_74 = lazy(() => import("./ArrType_74"));
const ArrType_75 = lazy(() => import("./ArrType_75"));
const ArrType_76 = lazy(() => import("./ArrType_76"));
const ArrType_77 = lazy(() => import("./ArrType_77"));
const ArrType_78 = lazy(() => import("./ArrType_78"));
const ArrType_79 = lazy(() => import("./ArrType_79"));
const ArrType_80 = lazy(() => import("./ArrType_80"));
const ArrType_81 = lazy(() => import("./ArrType_81"));
const ArrType_82 = lazy(() => import("./ArrType_82"));
const ArrType_83 = lazy(() => import("./ArrType_83"));
const ArrType_84 = lazy(() => import("./ArrType_84"));
const ArrType_85 = lazy(() => import("./ArrType_85"));
const ArrType_86 = lazy(() => import("./ArrType_86"));
const ArrType_87 = lazy(() => import("./ArrType_87"));
const ArrType_88 = lazy(() => import("./ArrType_88"));
const ArrType_89 = lazy(() => import("./ArrType_89"));
const ArrType_90 = lazy(() => import("./ArrType_90"));
const ArrType_91 = lazy(() => import("./ArrType_91"));
const ArrType_92 = lazy(() => import("./ArrType_92"));
const ArrType_93 = lazy(() => import("./ArrType_93"));
const ArrType_94 = lazy(() => import("./ArrType_94"));
const ArrType_95 = lazy(() => import("./ArrType_95"));
const ArrType_96 = lazy(() => import("./ArrType_96"));
const ArrType_97 = lazy(() => import("./ArrType_97"));
const ArrType_98 = lazy(() => import("./ArrType_98"));
const ArrType_99 = lazy(() => import("./ArrType_99"));
const ArrType_100 = lazy(() => import("./ArrType_100"));



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
        const { answer1, steps, count, defaultValue } = q.metadata;
        return provider(
          <Suspense fallback={<LoadingScreen />}>
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
          </Suspense>
        );
      }
      case "type2_1": {
        const opts = q.metadata.options ?? [];
        const presetLineNums = opts.map((lineNum: number, i: number) => ({
          dotIndex: i,
          lineNum,
        }));
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_2
              key={q.id}
              hint={q.metadata.hint}
              mode={q.metadata?.mode}
              presetLineNums={presetLineNums}
              dotCount={opts.length}
            />
          </Suspense>
        );
      }
      case "type2_2": {
        const opts = q.metadata.options ?? [];
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_2
              key={q.id}
              hint={q.metadata.hint}
              mode={q.metadata?.mode}
              presetBoxNumbers={opts}
              dotCount={opts.length}
            />
          </Suspense>
        );
      }
      case "type3": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_3 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type4": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_4 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type5_1":
      case "type5_2": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_5
              key={q.id}
              hint={q.metadata.hint}
              method={q.metadata.method}
              data={q.metadata.data ?? []}
            />
          </Suspense>
        );
      }
      case "type6_1":
      case "type6_2": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_6
              key={q.id}
              hint={q.metadata.hint}
              method={q.metadata.method}
              data={q.metadata.data ?? []}
            />
          </Suspense>
        );
      }
      case "type7": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_7 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type8": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_8 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type9": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_9 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type10": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_10 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type11": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_11 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type12": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_12 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type13_1": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_13 key={q.id} hint={q.metadata.hint} dataOne={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type13_2": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_13 key={q.id} hint={q.metadata.hint} dataTwo={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type14_1":
      case "type14_2": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_14 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type15": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_15 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type16": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_16 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type17": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_17 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type18": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_18 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type19": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_19 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type20": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_20 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type21": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_21 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type22": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_22 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type23": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_23 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type24": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_24 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type25": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_25 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type26": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_26 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type27": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_27 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type28": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_28 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type29": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_29 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type30": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_30 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type31": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_31 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type32": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_32 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type33": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_33 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type34": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_34 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type35": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_35 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type36": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_36 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type37": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_37 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type38": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_38 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type39": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_39 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type40": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_40 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type41": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_41 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type42": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_42 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type43": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_43 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type44": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_44 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type45": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_45 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type46": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_46 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type47": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_47 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type48": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_48 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type49": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_49 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type50": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_50 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type51": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_51 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type52": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_52 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type53": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_53 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type54": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_54 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type55": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_55 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type56": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_56 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type57": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_57 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type58": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_58 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type59": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_59 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type60": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_60 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type61": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_61 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type62": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_62 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type63": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_63 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type64": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_64 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type65": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_65 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type66": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_66 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type67": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_67 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type68": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_68 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type69": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_69 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type70": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_70 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type71": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_71 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type72": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_72 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type73": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_73 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type74": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_74 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type75": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_75 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type76": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_76 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type77": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_77 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type78": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_78 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type79": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_79 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type80": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_80 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type81": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_81 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type82": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_82 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type83": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_83 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type84": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_84 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type85": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_85 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type86": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_86 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type87": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_87 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type88": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_88 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type89": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_89 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type90": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_90 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type91": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_91 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type92": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_92 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type93": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_93 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type94": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_94 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type95": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_95 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type96": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_96 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type97": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_97 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type98": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_98 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type99": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_99 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      case "type100": {
        return provider(
          <Suspense fallback={<LoadingScreen />}>
            <ArrType_100 key={q.id} hint={q.metadata.hint} data={q.metadata.data ?? []} />
          </Suspense>
        );
      }
      default:
        return null;
    }

  }, [q])
}