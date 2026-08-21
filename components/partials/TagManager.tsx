export default function TagManager() {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-HGE2T2J8ZT"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HGE2T2J8ZT');
          `,
        }}
      />
    </>
  );
}