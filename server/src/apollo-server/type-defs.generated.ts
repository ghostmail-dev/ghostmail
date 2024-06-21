import type { DocumentNode } from "graphql";
export const typeDefs = {
  kind: "Document",
  definitions: [
    {
      kind: "ScalarTypeDefinition",
      name: { kind: "Name", value: "LocalDate", loc: { start: 7, end: 16 } },
      directives: [],
      loc: { start: 0, end: 16 },
    },
    {
      kind: "ScalarTypeDefinition",
      name: { kind: "Name", value: "Date", loc: { start: 25, end: 29 } },
      directives: [],
      loc: { start: 18, end: 29 },
    },
    {
      kind: "ScalarTypeDefinition",
      name: { kind: "Name", value: "ObjectID", loc: { start: 38, end: 46 } },
      directives: [],
      loc: { start: 31, end: 46 },
    },
    {
      kind: "InterfaceTypeDefinition",
      name: { kind: "Name", value: "Error", loc: { start: 58, end: 63 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "message", loc: { start: 68, end: 75 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 77, end: 83 },
              },
              loc: { start: 77, end: 83 },
            },
            loc: { start: 77, end: 84 },
          },
          directives: [],
          loc: { start: 68, end: 84 },
        },
      ],
      loc: { start: 48, end: 86 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "Query", loc: { start: 93, end: 98 } },
      interfaces: [],
      directives: [],
      fields: [],
      loc: { start: 88, end: 98 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "Mutation", loc: { start: 105, end: 113 } },
      interfaces: [],
      directives: [],
      fields: [],
      loc: { start: 100, end: 113 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "Email", loc: { start: 119, end: 124 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "_id", loc: { start: 129, end: 132 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ID",
                loc: { start: 134, end: 136 },
              },
              loc: { start: 134, end: 136 },
            },
            loc: { start: 134, end: 137 },
          },
          directives: [],
          loc: { start: 129, end: 137 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "html", loc: { start: 140, end: 144 } },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 146, end: 152 },
            },
            loc: { start: 146, end: 152 },
          },
          directives: [],
          loc: { start: 140, end: 152 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "text", loc: { start: 155, end: 159 } },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 161, end: 167 },
            },
            loc: { start: 161, end: 167 },
          },
          directives: [],
          loc: { start: 155, end: 167 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "textAsHtml",
            loc: { start: 170, end: 180 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 182, end: 188 },
            },
            loc: { start: 182, end: 188 },
          },
          directives: [],
          loc: { start: 170, end: 188 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "subject",
            loc: { start: 191, end: 198 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 200, end: 206 },
            },
            loc: { start: 200, end: 206 },
          },
          directives: [],
          loc: { start: 191, end: 206 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "date", loc: { start: 209, end: 213 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Date",
                loc: { start: 215, end: 219 },
              },
              loc: { start: 215, end: 219 },
            },
            loc: { start: 215, end: 220 },
          },
          directives: [],
          loc: { start: 209, end: 220 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "messageId",
            loc: { start: 223, end: 232 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 234, end: 240 },
            },
            loc: { start: 234, end: 240 },
          },
          directives: [],
          loc: { start: 223, end: 240 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "fromText",
            loc: { start: 243, end: 251 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 253, end: 259 },
            },
            loc: { start: 253, end: 259 },
          },
          directives: [],
          loc: { start: 243, end: 259 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "toText",
            loc: { start: 262, end: 268 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 270, end: 276 },
            },
            loc: { start: 270, end: 276 },
          },
          directives: [],
          loc: { start: 262, end: 276 },
        },
      ],
      loc: { start: 114, end: 278 },
    },
    {
      kind: "ObjectTypeExtension",
      name: { kind: "Name", value: "Query", loc: { start: 291, end: 296 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "email", loc: { start: 301, end: 306 } },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "_id",
                loc: { start: 307, end: 310 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                    loc: { start: 312, end: 314 },
                  },
                  loc: { start: 312, end: 314 },
                },
                loc: { start: 312, end: 315 },
              },
              directives: [],
              loc: { start: 307, end: 315 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Email",
              loc: { start: 318, end: 323 },
            },
            loc: { start: 318, end: 323 },
          },
          directives: [],
          loc: { start: 301, end: 323 },
        },
      ],
      loc: { start: 279, end: 325 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "Mailbox", loc: { start: 331, end: 338 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "_id", loc: { start: 343, end: 346 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ObjectID",
                loc: { start: 348, end: 356 },
              },
              loc: { start: 348, end: 356 },
            },
            loc: { start: 348, end: 357 },
          },
          directives: [],
          loc: { start: 343, end: 357 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "name", loc: { start: 360, end: 364 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 366, end: 372 },
              },
              loc: { start: 366, end: 372 },
            },
            loc: { start: 366, end: 373 },
          },
          directives: [],
          loc: { start: 360, end: 373 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "username",
            loc: { start: 376, end: 384 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 386, end: 392 },
              },
              loc: { start: 386, end: 392 },
            },
            loc: { start: 386, end: 393 },
          },
          directives: [],
          loc: { start: 376, end: 393 },
        },
      ],
      loc: { start: 326, end: 395 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "Message", loc: { start: 401, end: 408 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "emailId",
            loc: { start: 413, end: 420 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ObjectID",
                loc: { start: 422, end: 430 },
              },
              loc: { start: 422, end: 430 },
            },
            loc: { start: 422, end: 431 },
          },
          directives: [],
          loc: { start: 413, end: 431 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "sender",
            loc: { start: 434, end: 440 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 442, end: 448 },
            },
            loc: { start: 442, end: 448 },
          },
          directives: [],
          loc: { start: 434, end: 448 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "subject",
            loc: { start: 451, end: 458 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 460, end: 466 },
            },
            loc: { start: 460, end: 466 },
          },
          directives: [],
          loc: { start: 451, end: 466 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "date", loc: { start: 469, end: 473 } },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Date",
              loc: { start: 475, end: 479 },
            },
            loc: { start: 475, end: 479 },
          },
          directives: [],
          loc: { start: 469, end: 479 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "isRead",
            loc: { start: 482, end: 488 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
              loc: { start: 490, end: 497 },
            },
            loc: { start: 490, end: 497 },
          },
          directives: [],
          loc: { start: 482, end: 497 },
        },
      ],
      loc: { start: 396, end: 499 },
    },
    {
      kind: "ObjectTypeExtension",
      name: { kind: "Name", value: "Mailbox", loc: { start: 513, end: 520 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "messages",
            loc: { start: 525, end: 533 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "Message",
                    loc: { start: 536, end: 543 },
                  },
                  loc: { start: 536, end: 543 },
                },
                loc: { start: 536, end: 544 },
              },
              loc: { start: 535, end: 545 },
            },
            loc: { start: 535, end: 546 },
          },
          directives: [],
          loc: { start: 525, end: 546 },
        },
      ],
      loc: { start: 501, end: 548 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "InvalidApiKeyError",
        loc: { start: 554, end: 572 },
      },
      interfaces: [
        {
          kind: "NamedType",
          name: { kind: "Name", value: "Error", loc: { start: 584, end: 589 } },
          loc: { start: 584, end: 589 },
        },
      ],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "message",
            loc: { start: 594, end: 601 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 603, end: 609 },
              },
              loc: { start: 603, end: 609 },
            },
            loc: { start: 603, end: 610 },
          },
          directives: [],
          loc: { start: 594, end: 610 },
        },
      ],
      loc: { start: 549, end: 612 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "NewMailbox",
        loc: { start: 619, end: 629 },
      },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "_id", loc: { start: 634, end: 637 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ObjectID",
                loc: { start: 639, end: 647 },
              },
              loc: { start: 639, end: 647 },
            },
            loc: { start: 639, end: 648 },
          },
          directives: [],
          loc: { start: 634, end: 648 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "name", loc: { start: 651, end: 655 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 657, end: 663 },
              },
              loc: { start: 657, end: 663 },
            },
            loc: { start: 657, end: 664 },
          },
          directives: [],
          loc: { start: 651, end: 664 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "username",
            loc: { start: 667, end: 675 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 677, end: 683 },
              },
              loc: { start: 677, end: 683 },
            },
            loc: { start: 677, end: 684 },
          },
          directives: [],
          loc: { start: 667, end: 684 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "password",
            loc: { start: 687, end: 695 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 697, end: 703 },
              },
              loc: { start: 697, end: 703 },
            },
            loc: { start: 697, end: 704 },
          },
          directives: [],
          loc: { start: 687, end: 704 },
        },
      ],
      loc: { start: 614, end: 706 },
    },
    {
      kind: "UnionTypeDefinition",
      name: {
        kind: "Name",
        value: "CreateMailboxResponse",
        loc: { start: 714, end: 735 },
      },
      directives: [],
      types: [
        {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "NewMailbox",
            loc: { start: 738, end: 748 },
          },
          loc: { start: 738, end: 748 },
        },
        {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "InvalidApiKeyError",
            loc: { start: 751, end: 769 },
          },
          loc: { start: 751, end: 769 },
        },
      ],
      loc: { start: 708, end: 769 },
    },
    {
      kind: "ObjectTypeExtension",
      name: { kind: "Name", value: "Mutation", loc: { start: 783, end: 791 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "createMailbox",
            loc: { start: 796, end: 809 },
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "apiKey",
                loc: { start: 810, end: 816 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                    loc: { start: 818, end: 820 },
                  },
                  loc: { start: 818, end: 820 },
                },
                loc: { start: 818, end: 821 },
              },
              directives: [],
              loc: { start: 810, end: 821 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "CreateMailboxResponse",
              loc: { start: 824, end: 845 },
            },
            loc: { start: 824, end: 845 },
          },
          directives: [],
          loc: { start: 796, end: 845 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "login", loc: { start: 848, end: 853 } },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "username",
                loc: { start: 854, end: 862 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "String",
                    loc: { start: 864, end: 870 },
                  },
                  loc: { start: 864, end: 870 },
                },
                loc: { start: 864, end: 871 },
              },
              directives: [],
              loc: { start: 854, end: 871 },
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "password",
                loc: { start: 873, end: 881 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "String",
                    loc: { start: 883, end: 889 },
                  },
                  loc: { start: 883, end: 889 },
                },
                loc: { start: 883, end: 890 },
              },
              directives: [],
              loc: { start: 873, end: 890 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
              loc: { start: 893, end: 900 },
            },
            loc: { start: 893, end: 900 },
          },
          directives: [],
          loc: { start: 848, end: 900 },
        },
      ],
      loc: { start: 771, end: 902 },
    },
    {
      kind: "ObjectTypeExtension",
      name: { kind: "Name", value: "Query", loc: { start: 915, end: 920 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "mailbox",
            loc: { start: 925, end: 932 },
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "name",
                loc: { start: 933, end: 937 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "String",
                    loc: { start: 939, end: 945 },
                  },
                  loc: { start: 939, end: 945 },
                },
                loc: { start: 939, end: 946 },
              },
              directives: [],
              loc: { start: 933, end: 946 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Mailbox",
              loc: { start: 949, end: 956 },
            },
            loc: { start: 949, end: 956 },
          },
          directives: [],
          loc: { start: 925, end: 956 },
        },
      ],
      loc: { start: 903, end: 958 },
    },
  ],
  loc: { start: 0, end: 959 },
} as unknown as DocumentNode;
