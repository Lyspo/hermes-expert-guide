import { TRACKS } from '@/lib/site'

/**
 * Runs before first paint, in <head>.
 *
 * Reads the reader's track and motion preference and stamps them onto <html> so
 * CSS can adapt the page with no flash of wrong content and no hydration
 * mismatch — React never manages these attributes. If anything is missing or
 * corrupt, the attributes stay unset, which is the complete-content default a
 * crawler or no-JS reader gets.
 *
 * Kept deliberately tiny and dependency-free: it blocks paint.
 */
export function PrefaceScript() {
  const script = `try{
var s=localStorage.getItem('hermes-guide');if(!s)return;
var d=JSON.parse(s),t=d&&d.track,m=d&&d.prefs&&d.prefs.motion;
if(${JSON.stringify(TRACKS)}.indexOf(t)>-1)document.documentElement.dataset.track=t;
if(m==='reduced')document.documentElement.dataset.motion='reduced';
}catch(e){}`

  return (
    <script
      // The value is a literal built at module scope from a constant array; no
      // request or user data reaches it.
      dangerouslySetInnerHTML={{ __html: `(function(){${script}})()` }}
    />
  )
}
