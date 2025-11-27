import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

type ItemType = {
    link: String,
    nome: String,
    icone: React.ReactNode,
}
type ItemTypes = {
    index?: number,
    item: ItemType
}

function Item({ index, item }: ItemTypes) {

    const path = usePathname();
    const activeItem = path.split('/')[path.split('/').length - 1];

    const cssDefault = 'text-2xl flex gap-3 items-center hover:opacity-60 transition-all duration-300 cursor-pointer text-neutral-400 opacity-80';
    const cssActive = 'text-2xl flex gap-3 items-center cursor-pointer text-neutral-400 font-semibold';

    const css = activeItem === item.nome.toString().toLowerCase() ? cssActive : cssDefault;

    return (
        <Link href={`${item.link}`}>
            <div key={index} className={css}>
                {item.icone}
                {item.nome}
            </div>
        </Link>
    )
}

export { Item, type ItemType }
