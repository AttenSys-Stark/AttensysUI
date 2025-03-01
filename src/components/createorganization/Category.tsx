import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState } from "react";
import {
  walletStarknetkitNextAtom,
  organzationInitState,
  isinputError,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";

const Organizationcategory = [
  { id: 1, name: "Select from predefined categories" },
  { id: 2, name: "Design" },
  { id: 3, name: "Web2" },
  { id: 4, name: "Web3" },
  { id: 5, name: "Health" },
];

export default function Category() {
  const [selected, setSelected] = useState(Organizationcategory[0]);
  const [organizationData, setOrganizationData] = useAtom(organzationInitState);
  const [inputError, setInputError] = useAtom(isinputError);

  const handleCategoryChange = (category: any) => {
    setSelected(category); // Update selected category
    setOrganizationData((prev) => ({
      ...prev,
      organizationCategory: category.name, // Update organization category in state
    }));
    setInputError(false);
  };

  return (
    <div className="lg:w-[90%] w-full h-[55px] ">
      <Listbox value={selected} onChange={handleCategoryChange}>
        <ListboxButton
          className={clsx(
            "relative block w-full border-[2px] border-[#D0D5DD] rounded-lg bg-[#FFFFFF] h-[56px] py-1.5 pr-8 pl-3 text-left text-sm/6 text-[#98999B]",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
          )}
        >
          {selected?.name}
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-4 size-6 fill-[#111111]"
            aria-hidden="true"
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-[var(--button-width)] rounded-xl border border-[#98999B] bg-[#FFFFFF] p-1 mt-2 [--anchor-gap:var(--spacing-1)] focus:outline-none",
            "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 h-[100px]",
          )}
        >
          {Organizationcategory.map((org) => (
            <ListboxOption
              key={org.name}
              value={org}
              className="group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
            >
              <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
              <div className="text-sm/6 text-[#2D3A4B] cursor-pointer">
                {org.name}
              </div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
