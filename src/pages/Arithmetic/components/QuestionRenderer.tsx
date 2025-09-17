import React, { Suspense, useMemo } from "react";
import { QuestionMetaProvider } from "@/context/QuestionMetaContext";
import LoadingScreen from "@/components/common/LoadingScreen";

// Map question types → lazy-loaded components
const componentMap: Record<string, React.LazyExoticComponent<any>> = {
  type1: React.lazy(() => import("./ArrType_1")),
  type2_1: React.lazy(() => import("./ArrType_2")),
  type2_2: React.lazy(() => import("./ArrType_2")),
  type3: React.lazy(() => import("./ArrType_3")),
  type4: React.lazy(() => import("./ArrType_4")),
  type5_1: React.lazy(() => import("./ArrType_5")),
  type5_2: React.lazy(() => import("./ArrType_5")),
  type6_1: React.lazy(() => import("./ArrType_6")),
  type6_2: React.lazy(() => import("./ArrType_6")),
  type7: React.lazy(() => import("./ArrType_7")),
  type8: React.lazy(() => import("./ArrType_8")),
  type9: React.lazy(() => import("./ArrType_9")),
  type10: React.lazy(() => import("./ArrType_10")),
  type11: React.lazy(() => import("./ArrType_11")),
  type12: React.lazy(() => import("./ArrType_12")),
  type13_1: React.lazy(() => import("./ArrType_13")),
  type13_2: React.lazy(() => import("./ArrType_13")),
  type14_1: React.lazy(() => import("./ArrType_14")),
  type14_2: React.lazy(() => import("./ArrType_14")),
  type15: React.lazy(() => import("./ArrType_15")),
  type16: React.lazy(() => import("./ArrType_16")),
  type17: React.lazy(() => import("./ArrType_17")),
  type18: React.lazy(() => import("./ArrType_18")),
  type19: React.lazy(() => import("./ArrType_19")),
  type20: React.lazy(() => import("./ArrType_20")),
  type21: React.lazy(() => import("./ArrType_21")),
  type22: React.lazy(() => import("./ArrType_22")),
  type23: React.lazy(() => import("./ArrType_23")),
  type24: React.lazy(() => import("./ArrType_24")),
  type25: React.lazy(() => import("./ArrType_25")),
  type26: React.lazy(() => import("./ArrType_26")),
  type27: React.lazy(() => import("./ArrType_27")),
  type28: React.lazy(() => import("./ArrType_28")),
  type29: React.lazy(() => import("./ArrType_29")),
  type30: React.lazy(() => import("./ArrType_30")),
  type31: React.lazy(() => import("./ArrType_31")),
  type32: React.lazy(() => import("./ArrType_32")),
  type33: React.lazy(() => import("./ArrType_33")),
  type34: React.lazy(() => import("./ArrType_34")),
  type35: React.lazy(() => import("./ArrType_35")),
  type36: React.lazy(() => import("./ArrType_36")),
  type37: React.lazy(() => import("./ArrType_37")),
  type38: React.lazy(() => import("./ArrType_38")),
  type39: React.lazy(() => import("./ArrType_39")),
  type40: React.lazy(() => import("./ArrType_40")),
  type41: React.lazy(() => import("./ArrType_41")),
  type42: React.lazy(() => import("./ArrType_42")),
  type43: React.lazy(() => import("./ArrType_43")),
  type44: React.lazy(() => import("./ArrType_44")),
  type45: React.lazy(() => import("./ArrType_45")),
  type46: React.lazy(() => import("./ArrType_46")),
  type47: React.lazy(() => import("./ArrType_47")),
  type48: React.lazy(() => import("./ArrType_48")),
  type49: React.lazy(() => import("./ArrType_49")),
  type50: React.lazy(() => import("./ArrType_50")),
  type51: React.lazy(() => import("./ArrType_51")),
  type52: React.lazy(() => import("./ArrType_52")),
  type53: React.lazy(() => import("./ArrType_53")),
  type54: React.lazy(() => import("./ArrType_54")),
  type55: React.lazy(() => import("./ArrType_55")),
  type56: React.lazy(() => import("./ArrType_56")),
  type57: React.lazy(() => import("./ArrType_57")),
  type58: React.lazy(() => import("./ArrType_58")),
  type59: React.lazy(() => import("./ArrType_59")),
  type60: React.lazy(() => import("./ArrType_60")),
  type61: React.lazy(() => import("./ArrType_61")),
  type62: React.lazy(() => import("./ArrType_62")),
  type63: React.lazy(() => import("./ArrType_63")),
  type64: React.lazy(() => import("./ArrType_64")),
  type65: React.lazy(() => import("./ArrType_65")),
  type66: React.lazy(() => import("./ArrType_66")),
  type67: React.lazy(() => import("./ArrType_67")),
  type68: React.lazy(() => import("./ArrType_68")),
  type69: React.lazy(() => import("./ArrType_69")),
  type70: React.lazy(() => import("./ArrType_70")),
};

export default function QuestionRenderer({ q }: { q: any }) {
  return useMemo(() => {
    if (!q) return null;

    const metaTitle = q?.metadata?.question ?? String(q?.type ?? q?.id);
    const SelectedComponent = componentMap[q.type];
    if (!SelectedComponent) return null;

    return (
      <QuestionMetaProvider value={{ id: q.id, title: metaTitle }}>
        <Suspense fallback={<LoadingScreen/>}>
          <SelectedComponent key={q.id} {...q.metadata} hint={q.metadata.hint} />
        </Suspense>
      </QuestionMetaProvider>
    );
  }, [q]);
}
