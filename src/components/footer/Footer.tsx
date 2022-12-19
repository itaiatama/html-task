import React from "react";
import FooterLinksItem from "./FooterLinksItem";
import { useState } from "react";

import "./footer.css";

const Footer = () => {
  const langs = [
    "English",
    "Deutschaktuelle",
    "Sprache",
    "Español",
    "Français",
    "Italiano",
    "日本語",
    "Polski",
    "Português",
    "Русский",
    "Svenska",
    "Türkçe",
    "简体中文",
  ];

  const policies = [
    "Terms of Use",
    "Privacy Policy",
    "Legal Policies",
    "Cookies Policy",
    "Cookie Information",
    "Jobs at ViacomCBS",
    "Last.fm Music",
  ];

  const [lang, setLang] = useState<number>(0);

  const LanguageSelection = (langs: string[], selected: number) => {
    return langs.map((item, index) => {
      const style = `footer-lang-item ${selected === index ? "footer-lang-item-selected" : ""}`;

      return (
        <a key={`$footer-lang-${index}`} href="#" className={style} onClick={() => setLang(index)}>
          {item}
        </a>
      );
    });
  };

  const Policies = (policies: string[]) => {
    return policies.map((item, index) => {
      return (
        <React.Fragment key={`policies-${index}`}>
          <a className="footer-link-sm" href="#">
            {item}
          </a>
          {policies.length - 1 !== index ? (
            <i className="fa-solid fa-circle footer-item-dot" />
          ) : null}
        </React.Fragment>
      );
    });
  };

  return (
    <footer className="footer">
      <div className="wrapper footer-wrapper-ve">
        <FooterLinksItem title={"company"} links={["About Last.fm", "Contact Us", "Jobs"]} />
        <FooterLinksItem
          title={"help"}
          links={["Track My Music", "Community Support", "Community Guidelines", "Help"]}
        />
        <FooterLinksItem
          title={"goodies"}
          links={["Download Scrobbler", "Developer API", "Free Music Downloads", "Merchandise"]}
        />
        <FooterLinksItem title={"account"} links={["Inbox", "Settings", "Last.fm Pro", "Logout"]} />
        <FooterLinksItem
          title={"follow us"}
          links={["Facebook", "Twitter", "Instagram", "YouTube"]}
        />
      </div>

      <div className="footer-separator" />

      <div className="wrapper footer-wrapper-h">
        <div className="footer-wrapper-vb">
          <div className="footer-geo">
            <ul className="footer-lang">{LanguageSelection(langs, lang)}</ul>

            <a className="footer-timezone" href="#">
              <span>Timezone: </span>
              <span className="footer-timezone-name">Europe/Moscow</span>
            </a>
          </div>

          <div className="footer-logo">
            <p className="footer-logo-text">Audioscrobbler</p>
            <img className="footer-logo-image" src="assets/footer-logo.png" />
          </div>
        </div>

        <div>
          <a className="footer-link-sm" href="#">
            CBS Interactive
          </a>
          <small className="footer-text-sm"> © 2022 Last.fm Ltd. All rights reserved </small>
          <i className="fa-solid fa-circle footer-item-dot"> </i>
          {Policies(policies)}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
