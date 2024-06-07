export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-5 pb-10 pt-[4.5rem]">
      <div className="flex items-center justify-center">{children}</div>
    </div>
  );
}
