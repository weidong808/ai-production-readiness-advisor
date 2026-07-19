import type { DimensionId } from "@/lib/scoring/types";

export type CorpusChunk = {
  id: string;
  dimensionIds: DimensionId[];
  tags: string[];
  title: string;
  source: string;
  url: string | null;
  text: string;
};

export type CorpusFile = {
  version: string;
  chunks: CorpusChunk[];
};
