/* @ds-bundle: {"format":4,"namespace":"IronPulseDesignSystem_bc413e","components":[{"name":"Marquee","sourcePath":"components/brand/Marquee.jsx"},{"name":"MediaFrame","sourcePath":"components/brand/MediaFrame.jsx"},{"name":"ReactiveField","sourcePath":"components/brand/ReactiveField.jsx"},{"name":"RevealText","sourcePath":"components/brand/RevealText.jsx"},{"name":"SectionLabel","sourcePath":"components/brand/SectionLabel.jsx"},{"name":"StatFigure","sourcePath":"components/brand/StatFigure.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Tooltip","sourcePath":"components/core/Tooltip.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/brand/Marquee.jsx":"db8b2aa78a76","components/brand/MediaFrame.jsx":"acc4acf0ae3d","components/brand/ReactiveField.jsx":"dc329be45e08","components/brand/RevealText.jsx":"a5546ea01f5c","components/brand/SectionLabel.jsx":"351511ba695d","components/brand/StatFigure.jsx":"bb260b64b973","components/core/Badge.jsx":"357fe8ec1ac1","components/core/Button.jsx":"4b36d8264f2b","components/core/Card.jsx":"f269fba09b36","components/core/IconButton.jsx":"23139daff6f7","components/core/Tag.jsx":"3c04e49bbf80","components/core/Tooltip.jsx":"6c738e79ba84","components/feedback/Dialog.jsx":"0fa3746474e0","components/feedback/Toast.jsx":"8e93e3bbf50d","components/forms/Checkbox.jsx":"08be28170d07","components/forms/Input.jsx":"bb493d835095","components/forms/Radio.jsx":"ddd46a173996","components/forms/Select.jsx":"644736cd5e77","components/forms/Switch.jsx":"3fcfeb2798f1","components/navigation/NavBar.jsx":"74be7413ca68","components/navigation/Tabs.jsx":"9b2becd49984","ui_kits/ironpulse-web/App.jsx":"a931028c69a5","ui_kits/ironpulse-web/CoachGrid.jsx":"32baf3ca2926","ui_kits/ironpulse-web/FloorSection.jsx":"b77f06f61d8f","ui_kits/ironpulse-web/HeroFilm.jsx":"c48c7c5a6aaf","ui_kits/ironpulse-web/MembershipSection.jsx":"20b48fa0b6d7","ui_kits/ironpulse-web/ProgrammeRail.jsx":"28b21ce2c33e","ui_kits/ironpulse-web/SiteFooter.jsx":"b20743f774f2","ui_kits/ironpulse-web/ds-loader.js":"33106131739a"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.IronPulseDesignSystem_bc413e = window.IronPulseDesignSystem_bc413e || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Marquee.jsx
try { (() => {
function Marquee({
  items = [],
  speed = 26,
  reverse = false,
  outline = false,
  separator = "◆",
  className = ""
}) {
  const row = /*#__PURE__*/React.createElement("span", {
    className: ["ip-marquee__item", outline ? "ip-marquee__item--outline" : ""].filter(Boolean).join(" ")
  }, items.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("span", null, it), /*#__PURE__*/React.createElement("span", {
    className: "ip-marquee__sep"
  }, separator))));
  return /*#__PURE__*/React.createElement("div", {
    className: ["ip-marquee", reverse ? "ip-marquee--reverse" : "", className].filter(Boolean).join(" "),
    style: {
      "--ip-marquee-dur": speed + "s"
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ip-marquee__track"
  }, row), /*#__PURE__*/React.createElement("div", {
    className: "ip-marquee__track"
  }, row));
}
Object.assign(__ds_scope, { Marquee });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Marquee.jsx", error: String((e && e.message) || e) }); }

// components/brand/MediaFrame.jsx
try { (() => {
function MediaFrame({
  src,
  alt = "",
  aspect = "3 / 4",
  caption,
  mono = false,
  grain = true,
  reveal = true,
  parallax = 0,
  className = "",
  style
}) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(!reveal);
  const [shift, setShift] = React.useState(0);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, {
      threshold: .12
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  React.useEffect(() => {
    if (!parallax) return;
    const node = ref.current;
    const onScroll = () => {
      if (!node) return;
      const r = node.getBoundingClientRect();
      const mid = r.top + r.height / 2 - window.innerHeight / 2;
      setShift(-mid * parallax);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, [parallax]);
  return /*#__PURE__*/React.createElement("figure", {
    ref: ref,
    className: ["ip-media", mono ? "ip-media--mono" : "", className].filter(Boolean).join(" "),
    style: {
      aspectRatio: aspect,
      margin: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ip-media__clip " + (inView ? "ip-media__clip--in" : "ip-media__clip--hidden")
  }, /*#__PURE__*/React.createElement("img", {
    className: "ip-media__img",
    src: src,
    alt: alt,
    loading: "lazy",
    style: parallax ? {
      transform: "translate3d(0," + shift + "px,0) scale(1.12)"
    } : undefined
  }), /*#__PURE__*/React.createElement("span", {
    className: "ip-media__scrim"
  }), grain ? /*#__PURE__*/React.createElement("span", {
    className: "ip-media__grain"
  }) : null), caption ? /*#__PURE__*/React.createElement("figcaption", {
    className: "ip-media__caption"
  }, caption) : null);
}
Object.assign(__ds_scope, { MediaFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/MediaFrame.jsx", error: String((e && e.message) || e) }); }

// components/brand/ReactiveField.jsx
try { (() => {
function ReactiveField({
  intensity = 1,
  grid = false,
  grain = true,
  vignette = true,
  pulse = true,
  className = ""
}) {
  const ref = React.useRef(null);
  const [p, setP] = React.useState({
    x: .5,
    y: .4
  });
  const [vel, setVel] = React.useState(0);
  React.useEffect(() => {
    const onMove = e => {
      const node = ref.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      setP({
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height
      });
    };
    let last = window.scrollY,
      raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const d = Math.min(1, Math.abs(window.scrollY - last) / 90);
        last = window.scrollY;
        setVel(d);
        raf = 0;
      });
    };
    window.addEventListener("pointermove", onMove, {
      passive: true
    });
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const size = 60 * intensity;
  const emberStyle = {
    width: size + "vmax",
    height: size + "vmax",
    left: "calc(" + (p.x * 100).toFixed(2) + "% - " + size / 2 + "vmax)",
    top: "calc(" + (p.y * 100).toFixed(2) + "% - " + size / 2 + "vmax)",
    opacity: (.5 + vel * .5) * intensity
  };
  const pulseStyle = {
    width: size * 1.5 + "vmax",
    height: size * 1.5 + "vmax",
    right: "calc(" + (p.x * 26).toFixed(2) + "% - " + size * .75 + "vmax)",
    bottom: "calc(" + (10 + (1 - p.y) * 18).toFixed(2) + "% - " + size * .75 + "vmax)",
    opacity: (.42 + vel * .3) * intensity
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: ["ip-field-bg", className].filter(Boolean).join(" "),
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ip-field-bg__layer ip-field-bg__layer--ember",
    style: emberStyle
  }), pulse ? /*#__PURE__*/React.createElement("span", {
    className: "ip-field-bg__layer ip-field-bg__layer--pulse",
    style: pulseStyle
  }) : null, grid ? /*#__PURE__*/React.createElement("span", {
    className: "ip-field-bg__grid"
  }) : null, grain ? /*#__PURE__*/React.createElement("span", {
    className: "ip-field-bg__grain"
  }) : null, vignette ? /*#__PURE__*/React.createElement("span", {
    className: "ip-field-bg__vignette"
  }) : null);
}
Object.assign(__ds_scope, { ReactiveField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/ReactiveField.jsx", error: String((e && e.message) || e) }); }

// components/brand/RevealText.jsx
try { (() => {
function RevealText({
  lines = [],
  as = "h2",
  delay = 0,
  stagger = 70,
  className = "",
  style
}) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, {
      threshold: .25
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  const Node = as;
  const rows = Array.isArray(lines) ? lines : [lines];
  return /*#__PURE__*/React.createElement(Node, {
    ref: ref,
    className: ["ip-reveal", inView ? "ip-reveal--in" : "", className].filter(Boolean).join(" "),
    style: style
  }, rows.map((line, i) => /*#__PURE__*/React.createElement("span", {
    className: "ip-reveal__line",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "ip-reveal__inner",
    style: {
      transitionDelay: delay + i * stagger + "ms"
    }
  }, line))));
}
Object.assign(__ds_scope, { RevealText });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/RevealText.jsx", error: String((e && e.message) || e) }); }

// components/brand/SectionLabel.jsx
try { (() => {
function SectionLabel({
  children,
  index,
  rule = true,
  center = false,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: ["ip-eyebrow", center ? "ip-eyebrow--center" : "", className].filter(Boolean).join(" ")
  }, index ? /*#__PURE__*/React.createElement("span", {
    className: "ip-eyebrow__index"
  }, index) : null, /*#__PURE__*/React.createElement("span", null, children), rule ? /*#__PURE__*/React.createElement("span", {
    className: "ip-eyebrow__rule"
  }) : null);
}
Object.assign(__ds_scope, { SectionLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SectionLabel.jsx", error: String((e && e.message) || e) }); }

// components/brand/StatFigure.jsx
try { (() => {
function StatFigure({
  value,
  suffix,
  label,
  tone = "chalk",
  size = "lg",
  countUp = false,
  className = ""
}) {
  const [shown, setShown] = React.useState(countUp ? 0 : value);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!countUp) {
      setShown(value);
      return;
    }
    const target = parseFloat(String(value).replace(/[^\d.]/g, "")) || 0;
    const node = ref.current;
    if (!node) return;
    let raf, start;
    const run = () => {
      const step = t => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / 1400);
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) {
        run();
        io.disconnect();
      }
    }, {
      threshold: .4
    });
    io.observe(node);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, countUp]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: ["ip-stat", size === "sm" ? "ip-stat--sm" : "", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("span", {
    className: ["ip-stat__value", tone === "ember" ? "ip-stat__value--ember" : "", tone === "outline" ? "ip-stat__value--outline" : ""].filter(Boolean).join(" ")
  }, shown, suffix ? /*#__PURE__*/React.createElement("span", {
    className: "ip-stat__suffix"
  }, suffix) : null), label ? /*#__PURE__*/React.createElement("span", {
    className: "ip-stat__label"
  }, label) : null);
}
Object.assign(__ds_scope, { StatFigure });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/StatFigure.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  children,
  tone = "neutral",
  solid = false,
  live = false,
  className = "",
  ...rest
}) {
  const cls = ["ip-badge", "ip-badge--" + tone, solid ? "ip-badge--solid" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), live ? /*#__PURE__*/React.createElement("span", {
    className: "ip-badge__dot"
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  children,
  variant = "ember",
  size = "md",
  block = false,
  disabled = false,
  href,
  icon,
  iconPosition = "end",
  type = "button",
  onClick,
  className = "",
  ...rest
}) {
  const cls = ["ip-btn", "ip-btn--" + variant, "ip-btn--" + size, block ? "ip-btn--block" : "", className].filter(Boolean).join(" ");
  const glyph = icon ? /*#__PURE__*/React.createElement("span", {
    className: "ip-btn__icon"
  }, icon) : null;
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, iconPosition === "start" ? glyph : null, /*#__PURE__*/React.createElement("span", null, children), iconPosition === "end" ? glyph : null);
  if (href && !disabled) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href,
      onClick: onClick
    }, rest), inner);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    type: type,
    disabled: disabled,
    onClick: onClick
  }, rest), inner);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  title,
  text,
  index,
  image,
  imageAlt = "",
  aspect = "4 / 3",
  variant = "solid",
  interactive = false,
  href,
  footer,
  className = "",
  ...rest
}) {
  const cls = ["ip-card", variant === "glass" ? "ip-card--glass" : "", variant === "flat" ? "ip-card--flat" : "", interactive || href ? "ip-card--interactive" : "", className].filter(Boolean).join(" ");
  const Node = href ? "a" : "div";
  return /*#__PURE__*/React.createElement(Node, _extends({
    className: cls,
    href: href
  }, rest), image ? /*#__PURE__*/React.createElement("div", {
    className: "ip-card__media",
    style: {
      aspectRatio: aspect
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    loading: "lazy"
  })) : null, title || text || index || children ? /*#__PURE__*/React.createElement("div", {
    className: "ip-card__body"
  }, index ? /*#__PURE__*/React.createElement("span", {
    className: "ip-card__index"
  }, index) : null, title ? /*#__PURE__*/React.createElement("h3", {
    className: "ip-card__title"
  }, title) : null, text ? /*#__PURE__*/React.createElement("p", {
    className: "ip-card__text"
  }, text) : null, children) : null, footer);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  label,
  size = "md",
  variant = "outline",
  round = false,
  disabled = false,
  onClick,
  className = "",
  ...rest
}) {
  const cls = ["ip-iconbtn", "ip-iconbtn--" + size, variant === "solid" ? "ip-iconbtn--solid" : "", round ? "ip-iconbtn--round" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick
  }, rest), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  children,
  selected = false,
  interactive = false,
  onSelect,
  onRemove,
  className = "",
  ...rest
}) {
  const cls = ["ip-tag", interactive || onSelect ? "ip-tag--interactive" : "", selected ? "ip-tag--selected" : "", className].filter(Boolean).join(" ");
  const Node = onSelect ? "button" : "span";
  return /*#__PURE__*/React.createElement(Node, _extends({
    className: cls,
    type: onSelect ? "button" : undefined,
    "aria-pressed": onSelect ? selected : undefined,
    onClick: onSelect
  }, rest), children, onRemove ? /*#__PURE__*/React.createElement("span", {
    className: "ip-tag__remove",
    role: "button",
    "aria-label": "Remove",
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    }
  }, "\xD7") : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/Tooltip.jsx
try { (() => {
function Tooltip({
  children,
  label,
  position = "top",
  className = ""
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    className: ["ip-tip", className].filter(Boolean).join(" "),
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false)
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    className: ["ip-tip__bubble", "ip-tip__bubble--" + position, open ? "ip-tip__bubble--open" : ""].join(" ")
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = false,
  title,
  text,
  children,
  wide = false,
  onClose,
  actions,
  className = ""
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "ip-dialog__scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: ["ip-dialog__panel", wide ? "ip-dialog__panel--wide" : "", className].filter(Boolean).join(" "),
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    onClick: e => e.stopPropagation()
  }, onClose ? /*#__PURE__*/React.createElement("span", {
    className: "ip-dialog__close"
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    size: "sm",
    label: "Close",
    onClick: onClose,
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "square"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 6L6 18M6 6l12 12"
    }))
  })) : null, title ? /*#__PURE__*/React.createElement("h2", {
    className: "ip-dialog__title"
  }, title) : null, text ? /*#__PURE__*/React.createElement("p", {
    className: "ip-dialog__text"
  }, text) : null, children, actions ? /*#__PURE__*/React.createElement("div", {
    className: "ip-dialog__actions"
  }, actions) : null));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Toast({
  children,
  label,
  tone = "info",
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["ip-toast", className].filter(Boolean).join(" "),
    role: "status"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ip-toast__dot ip-toast__dot--" + tone
  }), /*#__PURE__*/React.createElement("span", {
    className: "ip-toast__body"
  }, label ? /*#__PURE__*/React.createElement("span", {
    className: "ip-toast__label"
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    className: "ip-toast__text"
  }, children)));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ["ip-choice", disabled ? "ip-choice--disabled" : "", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "ip-choice__box"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "ip-choice__mark",
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3.5",
    strokeLinecap: "square"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 13l4 4L19 7"
  }))), /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  multiline = false,
  id,
  className = "",
  ...rest
}) {
  const autoId = React.useId ? React.useId() : "ip-in";
  const fieldId = id || autoId;
  const Node = multiline ? "textarea" : "input";
  return /*#__PURE__*/React.createElement("div", {
    className: ["ip-field", className].filter(Boolean).join(" ")
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "ip-field__label",
    htmlFor: fieldId
  }, label) : null, /*#__PURE__*/React.createElement(Node, _extends({
    id: fieldId,
    className: ["ip-input", multiline ? "ip-input--textarea" : "", error ? "ip-input--invalid" : ""].filter(Boolean).join(" "),
    "aria-invalid": error ? true : undefined
  }, rest)), error ? /*#__PURE__*/React.createElement("span", {
    className: "ip-field__error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "ip-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Radio({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ["ip-choice", disabled ? "ip-choice--disabled" : "", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    onChange: onChange,
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "ip-choice__box ip-choice__box--radio"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ip-choice__radio-dot"
  })), /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  hint,
  error,
  options = [],
  id,
  className = "",
  ...rest
}) {
  const autoId = React.useId ? React.useId() : "ip-sel";
  const fieldId = id || autoId;
  return /*#__PURE__*/React.createElement("div", {
    className: ["ip-field", className].filter(Boolean).join(" ")
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "ip-field__label",
    htmlFor: fieldId
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    className: "ip-select"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId,
    "aria-invalid": error ? true : undefined
  }, rest), options.map(o => {
    const value = typeof o === "string" ? o : o.value;
    const text = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value
    }, text);
  })), /*#__PURE__*/React.createElement("span", {
    className: "ip-select__chevron",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "square"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  })))), error ? /*#__PURE__*/React.createElement("span", {
    className: "ip-field__error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "ip-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ["ip-switch", checked ? "ip-switch--on" : "", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    checked: checked,
    onChange: onChange,
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "ip-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ip-switch__knob"
  })), label ? /*#__PURE__*/React.createElement("span", null, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function NavBar({
  brand = "Ironpulse",
  links = [],
  active,
  onNavigate,
  action,
  solid = false,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: ["ip-nav", solid ? "ip-nav--solid" : "", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("span", {
    className: "ip-nav__mark"
  }, "Iron", /*#__PURE__*/React.createElement("em", null, "pulse")), /*#__PURE__*/React.createElement("ul", {
    className: "ip-nav__links"
  }, links.map(l => {
    const v = l.value || l;
    const label = l.label || l;
    return /*#__PURE__*/React.createElement("li", {
      key: v
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: ["ip-nav__link", active === v ? "ip-nav__link--active" : ""].join(" "),
      onClick: () => onNavigate && onNavigate(v)
    }, label));
  })), /*#__PURE__*/React.createElement("span", {
    className: "ip-nav__actions"
  }, action || /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm"
  }, "Book a trial")));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  onChange,
  children,
  className = ""
}) {
  const [internal, setInternal] = React.useState(items[0] && (items[0].value || items[0]));
  const active = value !== undefined ? value : internal;
  const select = v => {
    setInternal(v);
    if (onChange) onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: ["ip-tabs", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("div", {
    className: "ip-tabs__list",
    role: "tablist"
  }, items.map(it => {
    const v = it.value || it;
    const label = it.label || it;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": active === v,
      type: "button",
      className: ["ip-tabs__tab", active === v ? "ip-tabs__tab--active" : ""].join(" "),
      onClick: () => select(v)
    }, label);
  })), children);
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ironpulse-web/App.jsx
try { (() => {
function App() {
  const [view, setView] = React.useState("Programmes");
  const [solid, setSolid] = React.useState(false);
  const [joining, setJoining] = React.useState(false);
  const [film, setFilm] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > (window.innerHeight || 900) * .85);
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);
  const go = v => {
    setView(v);
    const map = {
      Programmes: "programmes",
      "The floor": "floor",
      Coaches: "coaches",
      Membership: "membership"
    };
    const el = document.getElementById(map[v]);
    if (el) window.scrollTo({
      top: el.offsetTop - 60,
      behavior: "smooth"
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(NavBar, {
    solid: solid,
    links: ["Programmes", "The floor", "Coaches", "Membership"],
    active: view,
    onNavigate: go,
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => setJoining(true)
    }, "Book a trial")
  }), /*#__PURE__*/React.createElement(HeroFilm, {
    onJoin: () => setJoining(true),
    onWatch: () => setFilm(true)
  }), /*#__PURE__*/React.createElement(Marquee, {
    items: ["Strength", "Conditioning", "Recovery", "Testing"],
    speed: 34
  }), /*#__PURE__*/React.createElement(FloorSection, null), /*#__PURE__*/React.createElement(ProgrammeRail, null), /*#__PURE__*/React.createElement(CoachGrid, null), /*#__PURE__*/React.createElement(MembershipSection, {
    onJoin: () => setJoining(true)
  }), /*#__PURE__*/React.createElement(SiteFooter, null), /*#__PURE__*/React.createElement(Dialog, {
    open: film,
    onClose: () => setFilm(false),
    wide: true,
    title: "Ironpulse \u2014 the floor",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setFilm(false);
        setJoining(true);
      }
    }, "Claim three days"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setFilm(false)
    }, "Close"))
  }, /*#__PURE__*/React.createElement("video", {
    controls: true,
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    poster: "../../assets/img/hero-athlete.webp",
    style: {
      width: "100%",
      aspectRatio: "16 / 9",
      objectFit: "cover",
      background: "var(--ink-000)",
      border: "1px solid var(--line-hairline)"
    }
  }, /*#__PURE__*/React.createElement("source", {
    src: "../../assets/video/hero.mp4",
    type: "video/mp4"
  }))), /*#__PURE__*/React.createElement(Dialog, {
    open: joining,
    onClose: () => setJoining(false),
    title: "Claim three days",
    text: "Full floor access and every coached session, for three days. No card needed.",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setJoining(false);
        setToast(true);
      }
    }, "Claim it"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setJoining(false)
    }, "Not now"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Full name",
    placeholder: "Sara Halim"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    placeholder: "you@domain.com"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Home club",
    options: ["Riverside", "Docklands", "Northgate"]
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Start",
    options: ["This week", "Next week", "Still deciding"]
  }))), toast ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      right: "var(--space-5)",
      bottom: "var(--space-5)",
      zIndex: 90
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    tone: "success",
    label: "Trial"
  }, "Three days confirmed. Check your inbox for the pass.")) : null);
}
Object.assign(window, {
  App
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ironpulse-web/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ironpulse-web/CoachGrid.jsx
try { (() => {
const IP_COACHES = [{
  name: "Sara Halim",
  role: "Head of strength",
  img: "../../assets/img/coach-sara.webp",
  tags: ["Powerlifting", "Return to sport"],
  cls: "k-c4"
}, {
  name: "Omar Zayed",
  role: "Performance lead",
  img: "../../assets/img/coach-omar.webp",
  tags: ["Olympic lifting"],
  cls: "k-c3 k-off9"
}, {
  name: "Nour Kassem",
  role: "Conditioning",
  img: "../../assets/img/coach-nour.webp",
  tags: ["Engine", "Zone two"],
  cls: "k-c3 k-off6"
}, {
  name: "Ahmed Farouk",
  role: "Nutrition",
  img: "../../assets/img/coach-ahmed.webp",
  tags: ["Body composition"],
  cls: "k-c2 k-off11"
}];
function CoachGrid() {
  const [open, setOpen] = React.useState(null);
  return /*#__PURE__*/React.createElement("section", {
    id: "coaches",
    style: {
      position: "relative",
      padding: "var(--section-pad-y) var(--gutter)",
      background: "var(--surface-base)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(ReactiveField, {
    intensity: .45,
    pulse: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      maxWidth: "var(--max-width)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "04"
  }, "Coaches"), /*#__PURE__*/React.createElement(RevealText, {
    as: "h2",
    lines: ["Coached, not", "supervised."],
    style: {
      font: "var(--text-role-display)",
      fontSize: "var(--fs-display-2)",
      fontStretch: "125%",
      textTransform: "uppercase",
      margin: "var(--space-6) 0 var(--space-9)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "k-grid",
    style: {
      alignItems: "start"
    }
  }, IP_COACHES.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.name,
    className: "coach " + c.cls,
    style: {
      cursor: "pointer"
    },
    onClick: () => setOpen(c)
  }, /*#__PURE__*/React.createElement(MediaFrame, {
    src: c.img,
    aspect: "3 / 4"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 10,
      borderTop: "1px solid var(--line-hairline)",
      marginTop: "var(--space-4)",
      paddingTop: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--fs-title-3)",
      fontStretch: "125%",
      textTransform: "uppercase",
      margin: 0
    }
  }, c.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--ls-micro)",
      textTransform: "uppercase",
      color: "var(--ember-500)"
    }
  }, c.role)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      flexWrap: "wrap",
      marginTop: "var(--space-3)"
    }
  }, c.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t
  }, t))))))), /*#__PURE__*/React.createElement(Dialog, {
    open: !!open,
    onClose: () => setOpen(null),
    wide: true,
    title: open ? open.name : "",
    text: open ? open.role + " — sessions run 06:00 to 11:00 and 16:00 to 20:00 at Riverside." : "",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, null, "Book an assessment"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setOpen(null)
    }, "Close"))
  }));
}
Object.assign(window, {
  CoachGrid,
  IP_COACHES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ironpulse-web/CoachGrid.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ironpulse-web/FloorSection.jsx
try { (() => {
function FloorSection() {
  return /*#__PURE__*/React.createElement("section", {
    id: "floor",
    style: {
      position: "relative",
      padding: "var(--section-pad-y) var(--gutter)",
      background: "var(--surface-base)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(ReactiveField, {
    intensity: .55,
    grid: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      maxWidth: "var(--max-width)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "02"
  }, "The floor"), /*#__PURE__*/React.createElement("div", {
    className: "k-grid",
    style: {
      marginTop: "var(--space-7)",
      alignItems: "end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-c7"
  }, /*#__PURE__*/React.createElement(RevealText, {
    as: "h2",
    lines: ["Nothing here", "is decorative."],
    style: {
      font: "var(--text-role-display)",
      fontStretch: "125%",
      letterSpacing: "var(--ls-display)",
      textTransform: "uppercase",
      color: "var(--chalk)",
      margin: 0
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "k-c4s9",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body-lg)",
      color: "var(--text-body)",
      maxWidth: "var(--measure-tight)"
    }
  }, "Three floors of calibrated plate, platforms that take a drop, and coaches who write the session before you arrive."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body-sm)",
      color: "var(--text-muted)",
      maxWidth: "var(--measure-tight)"
    }
  }, "Capacity is capped by the hour. You will never queue for a rack."))), /*#__PURE__*/React.createElement("div", {
    className: "k-grid",
    style: {
      marginTop: "var(--space-9)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement(MediaFrame, {
    className: "k-c5",
    src: "../../assets/img/about-weights.webp",
    aspect: "4 / 5",
    parallax: .08,
    caption: "Riverside \u2014 free weights"
  }), /*#__PURE__*/React.createElement("div", {
    className: "k-c3 k-off9",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(StatFigure, {
    size: "sm",
    value: 128,
    suffix: "kg",
    label: "Median deadlift at week 12",
    countUp: true,
    tone: "ember"
  }), /*#__PURE__*/React.createElement(StatFigure, {
    size: "sm",
    value: 96,
    suffix: "%",
    label: "Members past month three",
    countUp: true,
    tone: "outline"
  })), /*#__PURE__*/React.createElement(MediaFrame, {
    className: "k-c4 k-off11",
    src: "../../assets/img/about-gym-floor.webp",
    aspect: "16 / 11",
    parallax: .16,
    caption: "Northgate \u2014 conditioning hall"
  }))));
}
Object.assign(window, {
  FloorSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ironpulse-web/FloorSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ironpulse-web/HeroFilm.jsx
try { (() => {
function HeroFilm({
  onJoin,
  onWatch
}) {
  const [s, setS] = React.useState(0);
  const [cur, setCur] = React.useState({
    x: .5,
    y: .45
  });
  const [entered, setEntered] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const reduce = React.useRef(false);
  const vid = React.useRef(null);
  React.useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setEntered(true), 80);
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setS(Math.min(1.2, window.scrollY / (window.innerHeight || 900)));
        raf = 0;
      });
    };
    let praf = 0;
    const onMove = e => {
      if (praf || reduce.current) return;
      praf = requestAnimationFrame(() => {
        setCur({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight
        });
        praf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    window.addEventListener("pointermove", onMove, {
      passive: true
    });
    const v = vid.current;
    if (v) {
      if (v.readyState >= 3) setReady(true);
      const play = () => {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      };
      play();
    }
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
      if (praf) cancelAnimationFrame(praf);
    };
  }, []);
  const still = Math.min(1, s);
  const rm = reduce.current;
  const meta = {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--fs-micro)",
    letterSpacing: "var(--ls-micro)",
    textTransform: "uppercase",
    color: "var(--ink-700)"
  };
  // foreground drifts against the footage: cursor gives depth, scroll lifts the type away
  const drift = rm ? 0 : (cur.x - .5) * 14;
  const driftY = rm ? 0 : (cur.y - .5) * 8;
  const typeShift = rm ? 0 : -still * 90;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "relative",
      height: "100svh",
      minHeight: 620,
      overflow: "hidden",
      background: "var(--ink-000)",
      isolation: "isolate"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: "-2% -2%",
      willChange: "transform",
      transform: rm ? "none" : "translate3d(0," + still * 7 + "vh,0) scale(" + (1.03 + still * .09) + ")"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/img/hero-athlete.webp",
    alt: "",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "var(--img-filter-brand)"
    }
  }), /*#__PURE__*/React.createElement("video", {
    ref: vid,
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    preload: "auto",
    disablePictureInPicture: true,
    tabIndex: -1,
    poster: "../../assets/img/hero-athlete.webp",
    onCanPlay: () => setReady(true),
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "50% 42%",
      filter: "var(--img-filter-brand)",
      pointerEvents: "none",
      opacity: ready ? 1 : 0,
      transition: "opacity 900ms var(--ease-out-power)"
    }
  }, /*#__PURE__*/React.createElement("source", {
    src: "../../assets/video/hero.mp4",
    type: "video/mp4"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to bottom,rgba(5,6,10,.68) 0%,rgba(5,6,10,.34) 22%,rgba(5,6,10,.52) 44%,rgba(5,6,10,.80) 74%,rgba(5,6,10,.95) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--vignette)",
      opacity: .78 + still * .18
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to right,rgba(5,6,10,.86) 0%,rgba(5,6,10,.62) 34%,rgba(5,6,10,.18) 62%,rgba(5,6,10,.5) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      opacity: "var(--grain-opacity)",
      mixBlendMode: "overlay",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23g)'/%3E%3C/svg%3E\")"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      pointerEvents: "none",
      background: "var(--light-field-ember)",
      width: "64vmax",
      height: "64vmax",
      left: "calc(" + (cur.x * 100).toFixed(2) + "% - 32vmax)",
      top: "calc(" + (cur.y * 100).toFixed(2) + "% - 32vmax)",
      opacity: (.28 - still * .2) * (rm ? 0 : 1),
      transition: "left 1.3s var(--ease-out-power), top 1.3s var(--ease-out-power), opacity var(--dur-slow) var(--ease-out-power)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      pointerEvents: "none",
      background: "var(--light-field-pulse)",
      width: "78vmax",
      height: "78vmax",
      right: "calc(" + ((1 - cur.x) * 12).toFixed(2) + "% - 39vmax)",
      bottom: "calc(" + (cur.y * 10).toFixed(2) + "% - 39vmax)",
      opacity: .3,
      transition: "right 1.6s var(--ease-out-power), bottom 1.6s var(--ease-out-power)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      height: "100%",
      display: "grid",
      gridTemplateRows: "1fr auto",
      padding: "calc(var(--nav-h) + var(--space-6)) var(--gutter) var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      paddingBottom: "var(--space-5)",
      willChange: "transform",
      transform: "translate3d(" + drift.toFixed(2) + "px," + (typeShift + driftY).toFixed(2) + "px,0)",
      opacity: Math.max(0, 1 - still * 1.35)
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...meta,
      position: "relative",
      alignSelf: "flex-start",
      display: "flex",
      flexWrap: "wrap",
      columnGap: "var(--space-4)",
      rowGap: "6px",
      marginBottom: "var(--space-5)",
      padding: "7px 12px 6px",
      marginLeft: -12,
      color: "var(--ink-800)",
      background: "rgba(5,6,10,.62)",
      backdropFilter: "blur(var(--blur-glass))",
      borderLeft: "1px solid var(--line-accent)",
      opacity: entered ? 1 : 0,
      transform: entered ? "none" : "translateY(10px)",
      transition: "opacity var(--dur-slow) var(--ease-out-power) 120ms, transform var(--dur-slow) var(--ease-out-power) 120ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ember-500)"
    }
  }, "01"), /*#__PURE__*/React.createElement("span", null, "Riverside \xB7 Docklands \xB7 Northgate"), /*#__PURE__*/React.createElement("span", null, "24/7 floor access")), /*#__PURE__*/React.createElement(RevealText, {
    as: "h1",
    delay: 220,
    stagger: 110,
    lines: ["Power is", "practised."],
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--fw-black)",
      fontStretch: "125%",
      fontSize: "clamp(2.75rem,11.2vw,13rem)",
      lineHeight: "var(--lh-mega)",
      letterSpacing: "var(--ls-mega)",
      textTransform: "uppercase",
      color: "var(--chalk)",
      margin: 0,
      textShadow: "0 24px 80px rgba(5,6,10,.55)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "var(--space-4)",
      marginTop: "var(--space-7)",
      opacity: entered ? 1 : 0,
      transform: entered ? "none" : "translateY(18px)",
      transition: "opacity var(--dur-reveal) var(--ease-out-power) 620ms, transform var(--dur-reveal) var(--ease-out-power) 620ms"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onJoin,
    icon: /*#__PURE__*/React.createElement("span", null, "\u2192")
  }, "Claim three days"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "ghost",
    onClick: onWatch
  }, "Watch the film"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: "32ch",
      fontSize: "var(--fs-body-sm)",
      color: "var(--ink-800)",
      marginLeft: "var(--space-4)"
    }
  }, "A performance club for people who train on purpose. Coached strength, measured progress, no crowds."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "var(--space-4)",
      borderTop: "1px solid var(--line-hairline)",
      paddingTop: "var(--space-4)",
      opacity: Math.max(0, 1 - still * 1.6)
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...meta,
      display: "flex",
      gap: 10,
      alignItems: "center",
      minWidth: 0,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    live: true
  }, "Floor open"), /*#__PURE__*/React.createElement("span", null, "62% capacity \xB7 Riverside")), /*#__PURE__*/React.createElement("span", {
    style: {
      ...meta,
      display: "flex",
      alignItems: "center",
      gap: 12,
      flex: "0 0 auto"
    }
  }, "Scroll", /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 1,
      height: 34,
      background: "var(--ember-500)",
      transformOrigin: "top",
      animation: "ip-scroll-cue 2.4s var(--ease-in-out-power) infinite"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "26vh",
      pointerEvents: "none",
      background: "linear-gradient(to top,var(--surface-base) 0%,rgba(8,10,17,.86) 38%,transparent 100%)"
    }
  }));
}
Object.assign(window, {
  HeroFilm
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ironpulse-web/HeroFilm.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ironpulse-web/MembershipSection.jsx
try { (() => {
const IP_PLANS = [{
  name: "Floor",
  price: 59,
  annual: 590,
  text: "Full floor access, all clubs, no coaching.",
  features: ["24/7 access", "Open gym", "App programme library"]
}, {
  name: "Coached",
  price: 139,
  annual: 1390,
  text: "Everything on Floor plus twelve coached hours a week.",
  features: ["All classes", "Quarterly testing", "Written programme"],
  feature: true
}, {
  name: "Private",
  price: 320,
  annual: 3200,
  text: "One-to-one coaching, two sessions a week.",
  features: ["Dedicated coach", "Nutrition protocol", "Recovery suite"]
}];
function MembershipSection({
  onJoin
}) {
  const [annual, setAnnual] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    id: "membership",
    style: {
      padding: "var(--section-pad-y) var(--gutter)",
      background: "var(--ink-000)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--max-width)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "05"
  }, "Membership"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "var(--space-6)",
      margin: "var(--space-6) 0 var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--text-role-display)",
      fontSize: "var(--fs-display-2)",
      fontStretch: "125%",
      textTransform: "uppercase",
      margin: 0,
      maxWidth: "16ch"
    }
  }, "Three ways in"), /*#__PURE__*/React.createElement(Switch, {
    label: annual ? "Annual billing — two months free" : "Monthly billing",
    checked: annual,
    onChange: () => setAnnual(!annual)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
      gap: 1,
      background: "var(--line-hairline)"
    }
  }, IP_PLANS.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      background: p.feature ? "var(--surface-card)" : "var(--surface-base)",
      padding: "var(--space-7) var(--space-6)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--ls-micro)",
      textTransform: "uppercase",
      color: "var(--ink-600)"
    }
  }, String(i + 1).padStart(2, "0"), " / ", p.name), p.feature ? /*#__PURE__*/React.createElement(Badge, {
    tone: "ember",
    solid: true
  }, "Most taken") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-role-title)",
      fontSize: "var(--fs-display-3)",
      fontStretch: "125%",
      color: "var(--chalk)",
      fontVariantNumeric: "tabular-nums"
    }
  }, "\xA3", annual ? p.annual : p.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-micro)",
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: "var(--ember-500)",
      marginTop: 8
    }
  }, annual ? "/yr" : "/mo")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body-sm)",
      color: "var(--text-muted)"
    }
  }, p.text), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)",
      borderTop: "1px solid var(--line-hairline)",
      paddingTop: "var(--space-5)"
    }
  }, p.features.map(x => /*#__PURE__*/React.createElement("li", {
    key: x,
    style: {
      display: "flex",
      gap: 10,
      fontSize: "var(--fs-body-sm)",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ember-500)"
    }
  }, "\u2014"), x))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    block: true,
    variant: p.feature ? "ember" : "ghost",
    onClick: onJoin
  }, "Join ", p.name)))))));
}
Object.assign(window, {
  MembershipSection,
  IP_PLANS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ironpulse-web/MembershipSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ironpulse-web/ProgrammeRail.jsx
try { (() => {
const IP_PROGRAMMES = [{
  id: "strength",
  cat: "Strength",
  title: "Barbell Foundations",
  weeks: "8 weeks",
  img: "../../assets/img/program-strength.webp",
  text: "Squat, press, pull and hinge, loaded to a plan you can read."
}, {
  id: "conditioning",
  cat: "Conditioning",
  title: "Engine Room",
  weeks: "6 weeks",
  img: "../../assets/img/program-conditioning.webp",
  text: "Interval work built on watts, not guesswork."
}, {
  id: "conditioning",
  cat: "Conditioning",
  title: "Metabolic Cardio",
  weeks: "Ongoing",
  img: "../../assets/img/program-cardio.webp",
  text: "Zone-two blocks and sprint sets, coached in pairs."
}, {
  id: "classes",
  cat: "Classes",
  title: "Floor Sessions",
  weeks: "Weekly",
  img: "../../assets/img/program-classes.webp",
  text: "Twelve coached hours a week, capped at ten people."
}, {
  id: "nutrition",
  cat: "Nutrition",
  title: "Fuel Protocol",
  weeks: "12 weeks",
  img: "../../assets/img/program-nutrition.webp",
  text: "Intake mapped to training load, reviewed fortnightly."
}];
function ProgrammeRail() {
  const [cat, setCat] = React.useState("All");
  const cats = ["All", "Strength", "Conditioning", "Classes", "Nutrition"];
  const list = IP_PROGRAMMES.filter(p => cat === "All" || p.cat === cat);
  return /*#__PURE__*/React.createElement("section", {
    id: "programmes",
    style: {
      position: "relative",
      padding: "var(--section-pad-y) 0",
      background: "var(--ink-000)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--gutter)",
      maxWidth: "var(--max-width)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "03"
  }, "Programmes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-end",
      justifyContent: "space-between",
      columnGap: "var(--space-6)",
      rowGap: "var(--space-6)",
      marginTop: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--text-role-display)",
      fontSize: "var(--fs-display-2)",
      fontStretch: "125%",
      textTransform: "uppercase",
      margin: 0,
      maxWidth: "18ch",
      flex: "1 1 300px"
    }
  }, "Pick your discipline"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      flexWrap: "wrap",
      flex: "0 1 auto",
      paddingBottom: 4
    }
  }, cats.map(c => /*#__PURE__*/React.createElement(Tag, {
    key: c,
    selected: cat === c,
    onSelect: () => setCat(c)
  }, c))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--grid-gap)",
      overflowX: "auto",
      padding: "var(--space-8) var(--gutter)",
      scrollSnapType: "x mandatory"
    }
  }, list.map((p, i) => /*#__PURE__*/React.createElement("article", {
    key: p.title,
    className: "prog-panel",
    style: {
      scrollSnapAlign: "start",
      flex: "0 0 min(420px, 78vw)",
      position: "relative",
      borderTop: "1px solid var(--line-hairline)",
      paddingTop: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--ls-micro)",
      textTransform: "uppercase",
      color: "var(--ink-600)",
      marginBottom: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ember-500)"
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", null, p.cat), /*#__PURE__*/React.createElement("span", null, p.weeks)), /*#__PURE__*/React.createElement(MediaFrame, {
    src: p.img,
    aspect: "4 / 3"
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "var(--fs-title-2)",
      fontStretch: "125%",
      textTransform: "uppercase",
      margin: "var(--space-5) 0 var(--space-3)"
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body-sm)",
      color: "var(--text-muted)",
      maxWidth: "38ch"
    }
  }, p.text), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "quiet",
    icon: /*#__PURE__*/React.createElement("span", null, "\u2192")
  }, "Programme detail"))))));
}
Object.assign(window, {
  ProgrammeRail,
  IP_PROGRAMMES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ironpulse-web/ProgrammeRail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ironpulse-web/SiteFooter.jsx
try { (() => {
function SiteFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--surface-base)",
      borderTop: "1px solid var(--line-hairline)"
    }
  }, /*#__PURE__*/React.createElement(Marquee, {
    items: ["Power", "Movement", "Discipline", "Performance"],
    outline: true,
    speed: 30
  }), /*#__PURE__*/React.createElement("div", {
    className: "k-grid",
    style: {
      padding: "var(--space-9) var(--gutter) var(--space-6)",
      maxWidth: "var(--max-width)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-c5",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "06",
    rule: false
  }, "Stay on programme"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--fs-body-sm)",
      color: "var(--text-muted)",
      maxWidth: "36ch"
    }
  }, "One email a week: the sessions, the numbers, the reading."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-3)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "you@domain.com",
    style: {
      minWidth: 240
    }
  }), /*#__PURE__*/React.createElement(Button, null, "Subscribe"))), [["Train", ["Programmes", "Timetable", "Coaches", "Testing"]], ["Clubs", ["Riverside", "Docklands", "Northgate", "Open a club"]], ["Company", ["About", "Careers", "Press", "Contact"]]].map(([h, items]) => /*#__PURE__*/React.createElement("div", {
    key: h,
    className: "k-c2",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--ls-micro)",
      textTransform: "uppercase",
      color: "var(--ink-600)"
    }
  }, h), items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      fontSize: "var(--fs-body-sm)",
      color: "var(--text-body)"
    }
  }, i))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--gutter)",
      maxWidth: "var(--max-width)",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    "aria-hidden": "true",
    style: {
      font: "var(--text-role-mega)",
      fontSize: "clamp(2.25rem,12.2vw,15rem)",
      whiteSpace: "nowrap",
      fontStretch: "125%",
      letterSpacing: "var(--ls-mega)",
      textTransform: "uppercase",
      color: "transparent",
      WebkitTextStroke: "1px var(--line-strong)",
      margin: "var(--space-6) 0 0",
      lineHeight: .8
    }
  }, "Ironpulse"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "var(--space-4)",
      borderTop: "1px solid var(--line-hairline)",
      marginTop: "var(--space-6)",
      padding: "var(--space-5) 0 var(--space-8)",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--fs-micro)",
      letterSpacing: "var(--ls-micro)",
      textTransform: "uppercase",
      color: "var(--ink-600)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 IronPulse Performance"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Instagram"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "YouTube"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Strava")), /*#__PURE__*/React.createElement("span", null, "Privacy \xB7 Terms"))));
}
Object.assign(window, {
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ironpulse-web/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/ironpulse-web/ds-loader.js
try { (() => {
/* Resolves the IronPulse primitives for this kit.
   Prefers the compiled design-system bundle (window.IronPulseDesignSystem_bc413e).
   If the bundle has not been compiled yet, it transpiles the component
   sources in the browser so the kit still renders. Dev convenience only. */
window.IPReady = async function () {
  const NS = "IronPulseDesignSystem_bc413e";
  if (window[NS] && window[NS].Button) return window[NS];
  const files = ["core/Button", "core/IconButton", "core/Badge", "core/Tag", "core/Card", "core/Tooltip", "forms/Input", "forms/Select", "forms/Checkbox", "forms/Radio", "forms/Switch", "feedback/Dialog", "feedback/Toast", "navigation/Tabs", "navigation/NavBar", "brand/SectionLabel", "brand/StatFigure", "brand/MediaFrame", "brand/RevealText", "brand/Marquee", "brand/ReactiveField"];
  const out = {};
  for (const rel of files) {
    const name = rel.split("/")[1];
    const src = await (await fetch("../../components/" + rel + ".jsx")).text();
    const clean = src.replace(/^\s*import[\s\S]*?;\s*$/gm, "").replace(/export\s+function/g, "function");
    const code = Babel.transform(clean, {
      presets: ["react"]
    }).code;
    new Function("React", "IP", code + "\n;IP['" + name + "']=" + name + ";")(React, out);
    Object.assign(window, out);
  }
  return out;
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/ironpulse-web/ds-loader.js", error: String((e && e.message) || e) }); }

__ds_ns.Marquee = __ds_scope.Marquee;

__ds_ns.MediaFrame = __ds_scope.MediaFrame;

__ds_ns.ReactiveField = __ds_scope.ReactiveField;

__ds_ns.RevealText = __ds_scope.RevealText;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.StatFigure = __ds_scope.StatFigure;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
