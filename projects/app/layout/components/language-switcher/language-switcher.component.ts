import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { LanguageService } from "auro-ui";

@Component({
  selector: "app-language-switcher",
  templateUrl: "./language-switcher.component.html",
  styleUrl: "./language-switcher.component.scss",
})
export class LanguageSwitcherComponent implements OnInit {
  langData: any = [
    { name: "English", code: "en" },
    { name: "हिंदी", code: "hi" },
    { name: "मराठी", code: "mr" },
    { name: "বাংলা", code: "bn" },
  ];
  selectedLang: string = "";
  constructor(
    private translate: LanguageService,
    private cdr: ChangeDetectorRef
  ) {
    this.translate.setDefaultLanguage("en");
  }
  ngOnInit(): void {
    this.selectedLang = "en";
    this.translate.useLanguage("en_US");
  }

  switchLanguage(language) {
    this.translate.useLanguage(language.value.toString());
    this.cdr.detectChanges();
  }
}
