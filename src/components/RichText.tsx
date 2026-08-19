import { PortableText, type PortableTextBlock } from "next-sanity";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export function RichText({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="rich-text">
      <PortableText
        value={value}
        components={{
          types: {
            image: ({ value }) => (
              <Image
                src={urlFor(value).width(1200).url()}
                alt={value.alt ?? ""}
                width={1200}
                height={675}
                className="my-6 rounded-2xl"
              />
            ),
          },
        }}
      />
    </div>
  );
}
