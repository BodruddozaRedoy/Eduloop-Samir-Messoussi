import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslateButton() {
  useEffect(() => {
    const scriptId = "google-translate-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "auto",
          includedLanguages: "en,es,fr,de,ar,bn,hi,zh,ja,ru",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    document.body.appendChild(script);
  }, []);

  const openTranslateMenu = () => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) combo.focus();
  };

  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <button
        onClick={openTranslateMenu}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        🌐 Translate
      </button>
    </>
  );
}
