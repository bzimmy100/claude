// Papendal video-eindkaart 9:16 — scene voor animations-v2 engine
(() => {
  const ORANGE = '#F1740E';
  const FONT = "'Anton', sans-serif";

  function useUnderlay(mode) {
    React.useEffect(() => {
      const svg = document.querySelector('svg[data-om-exportable-video-with-duration-secs]');
      if (!svg || mode === 'geen') return;
      const parent = svg.parentElement;
      parent.style.position = 'relative';
      const el = document.createElement(mode === 'foto' ? 'img' : 'div');
      if (mode === 'foto') { el.src = (window.__resources && window.__resources.previewMan) || './preview-man.png'; el.style.objectFit = 'cover'; }
      else { el.style.background = '#1a1a1a'; }
      el.style.position = 'absolute';
      parent.insertBefore(el, svg);
      const place = () => {
        const pr = parent.getBoundingClientRect(), r = svg.getBoundingClientRect();
        el.style.left = (r.left - pr.left) + 'px'; el.style.top = (r.top - pr.top) + 'px';
        el.style.width = r.width + 'px'; el.style.height = r.height + 'px';
      };
      place();
      const ro = new ResizeObserver(place); ro.observe(parent);
      const iv = setInterval(place, 400);
      return () => { ro.disconnect(); clearInterval(iv); el.remove(); };
    }, [mode]);
  }

  function Word({ text, color, from, start, end, size }) {
    const { progress } = useScene();
    const x = animate({ from, to: 0, start, end, ease: Easing.easeOutBack })(progress);
    const o = animate({ from: 0, to: 1, start, end: start + (end - start) * 0.45, ease: Easing.easeOutCubic })(progress);
    return (
      <div style={{ fontFamily: FONT, fontSize: size || 132, lineHeight: 1.06, color, whiteSpace: 'nowrap',
        transform: `translateX(${x}px)`, opacity: o,
        textShadow: '0 3px 22px rgba(0,0,0,0.35)' }}>{text}</div>
    );
  }

  function XMotif() {
    const { progress } = useScene();
    const o = animate({ from: 0, to: 0.18, start: 0.02, end: 0.22, ease: Easing.easeOutCubic })(progress);
    const y = animate({ from: 40, to: 0, start: 0.02, end: 0.3, ease: Easing.easeOutCubic })(progress);
    return (
      <img src={(window.__resources && window.__resources.motifLijnen) || "./motif-lijnen.png"} alt="" style={{ position: 'absolute', right: -220, top: -60,
        width: 1000, height: 'auto', opacity: o, transform: `translateY(${y}px)` }} />
    );
  }

  function Logo() {
    const { progress } = useScene();
    const y = animate({ from: -70, to: 0, start: 0.28, end: 0.42, ease: Easing.easeOutBack })(progress);
    const o = animate({ from: 0, to: 1, start: 0.28, end: 0.36 })(progress);
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top: 290, display: 'flex', justifyContent: 'center',
        transform: `translateY(${y}px)`, opacity: o }}>
        <img src={(window.__resources && window.__resources.papendalLogo) || "./papendal-logo.png"} alt="Papendal" style={{ height: 96, width: 'auto', display: 'block' }} />
      </div>
    );
  }

  function Badge() {
    const { progress } = useScene();
    const s = animate({ from: 0.35, to: 1, start: 0.34, end: 0.48, ease: Easing.easeOutBack })(progress);
    const o = animate({ from: 0, to: 1, start: 0.34, end: 0.4 })(progress);
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 448, display: 'flex', justifyContent: 'center' }}>
        <div style={{ transform: `scale(${s})`, transformOrigin: '50% 100%', opacity: o,
          background: '#0D0D0D', borderRadius: 12, padding: '14px 34px 16px',
          boxShadow: '0 10px 32px rgba(0,0,0,0.4)' }}>
          <span style={{ fontFamily: FONT, fontSize: 34, color: '#fff', letterSpacing: '0.03em' }}>
            PAPENDAL.NL/<span style={{ color: ORANGE }}>ZAKELIJK</span></span>
        </div>
      </div>
    );
  }

  function EndCard() {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <XMotif />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 402, display: 'grid', justifyItems: 'center' }}>
          <Word text="JOUW" color="#fff" from={-620} start={0.05} end={0.17} size={92} />
          <Word text="THUISBASIS" color="#fff" from={620} start={0.1} end={0.22} size={92} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1178, display: 'grid', justifyItems: 'center' }}>
          <Word text="VOOR" color="#fff" from={-620} start={0.15} end={0.27} size={92} />
          <Word text="TOPPRESTATIES" color={ORANGE} from={620} start={0.2} end={0.34} size={92} />
        </div>
        <Badge />
      </div>
    );
  }

  function App() {
    const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
    useUnderlay(t.previewBg);
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a' }}>
        <SceneStage width={1080} height={1920} bg="transparent"
          scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
          {{ 'Eindkaart': EndCard }}
        </SceneStage>
        <TweaksPanel>
          <TweakSection label="Voorbeeld" />
          <TweakRadio label="Achtergrond" value={t.previewBg} options={['foto', 'donker', 'geen']}
            onChange={(v) => setTweak('previewBg', v)} />
          <TweakSection label="Geavanceerd" />
          <TweakToggle label="Motion editor" value={t.motionEditor}
            onChange={(v) => setTweak('motionEditor', v)} />
        </TweaksPanel>
      </div>
    );
  }

  window.PapendalEndCard = App;
})();
