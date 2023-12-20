export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 pt-20 pb-10">
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
