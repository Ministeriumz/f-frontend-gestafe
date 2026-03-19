import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ItemType = {
  link: string;
  nome: string;
  icone: React.ReactNode;
};

type ItemTypes = {
  index?: number;
  item: ItemType;
};

function Item({ index, item }: ItemTypes) {
  const path = usePathname();
  const isActive = path === item.link || path.startsWith(`${item.link}/`);

  const css = isActive
    ? "text-sm md:text-[13px] flex gap-2 items-center cursor-pointer text-neutral-700 glass-soft px-3 py-2 rounded-md font-semibold whitespace-nowrap"
    : "text-sm md:text-[13px] flex gap-2 items-center hover:bg-white/35 transition-all duration-200 cursor-pointer text-neutral-600 px-3 py-2 rounded-md whitespace-nowrap";

  return (
    <Link href={item.link}>
      <div key={index} className={css}>
        {item.icone}
        <span>{item.nome}</span>
      </div>
    </Link>
  );
}

export { Item, type ItemType };
