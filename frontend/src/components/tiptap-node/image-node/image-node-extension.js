import { Node, mergeAttributes } from "@tiptap/core";

export const Image = Node.create({
  name: "image",
  group: "block",
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: "auto" },
      dataAlign: { default: "center" },
      "data-align": { default: "center" }, // For compatibility
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const align = HTMLAttributes.dataAlign || HTMLAttributes["data-align"] || "center";

    let marginStyle = "";
    if (align === "left") {
      marginStyle = "margin-left:0;margin-right:auto;";
    } else if (align === "right") {
      marginStyle = "margin-left:auto;margin-right:0;";
    } else {
      marginStyle = "margin-left:auto;margin-right:auto;";
    }

    return [
      "img",
      mergeAttributes(HTMLAttributes, {
        "data-align": align,
        style: `
          display:block;
          ${marginStyle}
          width:${HTMLAttributes.width || "auto"};
          max-width:100%;
          height:auto;
          border-radius:6px;
        `,
      }),
    ];
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: options,
          }),

      updateImageAttributes:
        (attrs) =>
        ({ chain }) =>
          chain().updateAttributes(this.name, attrs).run(),
    };
  },
});
