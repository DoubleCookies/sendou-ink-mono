import { weapons } from ".";
import { stages } from "./constants/stages";
import {
  headOnlyAbilities,
  clothingOnlyAbilities,
  shoesOnlyAbilities,
  stackableAbilities,
} from "./constants/abilities";
import { headGears } from "./constants/headGears";
import { clothingGears } from "./constants/clothingGears";
import { shoesGears } from "./constants/shoesGears";

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export type Weapon = ElementType<typeof weapons>;
export type Stage = ElementType<typeof stages>;

export type HeadOnlyAbility = ElementType<typeof headOnlyAbilities>;
export type ClothingOnlyAbility = ElementType<typeof clothingOnlyAbilities>;
export type ShoesOnlyAbility = ElementType<typeof shoesOnlyAbilities>;
export type StackableAbility = ElementType<typeof stackableAbilities>;

export type HeadGear = ElementType<typeof headGears>;
export type ClothingGear = ElementType<typeof clothingGears>;
export type ShoesGear = ElementType<typeof shoesGears>;

export type RankedMode = "SZ" | "TC" | "RM" | "CB";

export type PlusTier = "ONE" | "TWO";
export type PlusRegion = "EU" | "NA";
