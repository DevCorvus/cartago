export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container pt-24 pb-10 px-5 mx-auto">
      <div className="flex items-center justify-center">{children}</div>
    </div>
  );
}
