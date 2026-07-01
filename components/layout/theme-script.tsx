export function ThemeScript() {
  const script = `(function(){
    try {
      var s = localStorage.getItem('theme');
      if (s === 'dark') { document.documentElement.classList.add('dark'); }
      else if (s === 'light') { document.documentElement.classList.add('light'); }
    } catch(e){}
  })();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
