export default function ItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-6 pt-20 pb-6 bg-amber-50">{children}</div>;
}
