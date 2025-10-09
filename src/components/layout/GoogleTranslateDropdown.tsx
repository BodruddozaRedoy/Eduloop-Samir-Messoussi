"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslateDropdown() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const scriptId = "google-translate-script";
    if (document.getElementById(scriptId)) {
      waitForTranslate();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,es,fr,de,ar,bn,hi,zh,ja,ru",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );

      waitForTranslate();
    };

    document.body.appendChild(script);
  }, []);

  // Wait until Google creates the hidden combo box
  const waitForTranslate = () => {
    const interval = setInterval(() => {
      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        clearInterval(interval);
        setIsReady(true);
      }
    }, 500);
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "bn", label: "বাংলা" },
    { code: "hi", label: "हिन्दी" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "zh-CN", label: "中文" },
    { code: "ja", label: "日本語" },
    { code: "ru", label: "Русский" },
    { code: "ar", label: "العربية" },
  ];

  const changeLanguage = (langCode: string) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (!combo) return; // if somehow still not ready, ignore click

    combo.value = langCode;
    combo.dispatchEvent(new Event("change"));
  };

  return (
    <div className="relative">
      <div id="google_translate_element" className="hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={!isReady}
            className="flex items-center gap-2 border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            <Globe className="w-4 h-4" />
            {isReady ? "Translate" : "Loading..."}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-gray-900 text-gray-100 border-gray-700">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="cursor-pointer hover:bg-gray-800"
            >
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
