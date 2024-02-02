export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-20 pb-10 px-5">
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
