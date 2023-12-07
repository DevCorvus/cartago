export default function ItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 pt-20 pb-6 bg-amber-50 min-h-screen">
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
