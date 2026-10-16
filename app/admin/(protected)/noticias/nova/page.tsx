import { NewsEditor } from '@/components/admin-news';
export default function Nova() {
  return (
    <>
      <h1>Nova notícia</h1>
      <p className="muted">
        Comece pelo link da fonte e acrescente o comentário do escritório.
      </p>
      <NewsEditor />
    </>
  );
}
