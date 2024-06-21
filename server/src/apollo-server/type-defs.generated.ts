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
      ],
      loc: { start: 114, end: 242 },
    },
    {
      kind: "ObjectTypeExtension",
      name: { kind: "Name", value: "Query", loc: { start: 255, end: 260 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "email", loc: { start: 265, end: 270 } },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "_id",
                loc: { start: 271, end: 274 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                    loc: { start: 276, end: 278 },
                  },
                  loc: { start: 276, end: 278 },
                },
                loc: { start: 276, end: 279 },
              },
              directives: [],
              loc: { start: 271, end: 279 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Email",
              loc: { start: 282, end: 287 },
            },
            loc: { start: 282, end: 287 },
          },
          directives: [],
          loc: { start: 265, end: 287 },
        },
      ],
      loc: { start: 243, end: 289 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "Mailbox", loc: { start: 295, end: 302 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "_id", loc: { start: 307, end: 310 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ObjectID",
                loc: { start: 312, end: 320 },
              },
              loc: { start: 312, end: 320 },
            },
            loc: { start: 312, end: 321 },
          },
          directives: [],
          loc: { start: 307, end: 321 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "name", loc: { start: 324, end: 328 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 330, end: 336 },
              },
              loc: { start: 330, end: 336 },
            },
            loc: { start: 330, end: 337 },
          },
          directives: [],
          loc: { start: 324, end: 337 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "username",
            loc: { start: 340, end: 348 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 350, end: 356 },
              },
              loc: { start: 350, end: 356 },
            },
            loc: { start: 350, end: 357 },
          },
          directives: [],
          loc: { start: 340, end: 357 },
        },
      ],
      loc: { start: 290, end: 359 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "Message", loc: { start: 365, end: 372 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "emailId",
            loc: { start: 377, end: 384 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ObjectID",
                loc: { start: 386, end: 394 },
              },
              loc: { start: 386, end: 394 },
            },
            loc: { start: 386, end: 395 },
          },
          directives: [],
          loc: { start: 377, end: 395 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "sender",
            loc: { start: 398, end: 404 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 406, end: 412 },
            },
            loc: { start: 406, end: 412 },
          },
          directives: [],
          loc: { start: 398, end: 412 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "subject",
            loc: { start: 415, end: 422 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 424, end: 430 },
            },
            loc: { start: 424, end: 430 },
          },
          directives: [],
          loc: { start: 415, end: 430 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "date", loc: { start: 433, end: 437 } },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Date",
              loc: { start: 439, end: 443 },
            },
            loc: { start: 439, end: 443 },
          },
          directives: [],
          loc: { start: 433, end: 443 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "isRead",
            loc: { start: 446, end: 452 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
              loc: { start: 454, end: 461 },
            },
            loc: { start: 454, end: 461 },
          },
          directives: [],
          loc: { start: 446, end: 461 },
        },
      ],
      loc: { start: 360, end: 463 },
    },
    {
      kind: "ObjectTypeExtension",
      name: { kind: "Name", value: "Mailbox", loc: { start: 477, end: 484 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "messages",
            loc: { start: 489, end: 497 },
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
                    loc: { start: 500, end: 507 },
                  },
                  loc: { start: 500, end: 507 },
                },
                loc: { start: 500, end: 508 },
              },
              loc: { start: 499, end: 509 },
            },
            loc: { start: 499, end: 510 },
          },
          directives: [],
          loc: { start: 489, end: 510 },
        },
      ],
      loc: { start: 465, end: 512 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "InvalidApiKeyError",
        loc: { start: 518, end: 536 },
      },
      interfaces: [
        {
          kind: "NamedType",
          name: { kind: "Name", value: "Error", loc: { start: 548, end: 553 } },
          loc: { start: 548, end: 553 },
        },
      ],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "message",
            loc: { start: 558, end: 565 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 567, end: 573 },
              },
              loc: { start: 567, end: 573 },
            },
            loc: { start: 567, end: 574 },
          },
          directives: [],
          loc: { start: 558, end: 574 },
        },
      ],
      loc: { start: 513, end: 576 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "NewMailbox",
        loc: { start: 583, end: 593 },
      },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "_id", loc: { start: 598, end: 601 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ObjectID",
                loc: { start: 603, end: 611 },
              },
              loc: { start: 603, end: 611 },
            },
            loc: { start: 603, end: 612 },
          },
          directives: [],
          loc: { start: 598, end: 612 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "name", loc: { start: 615, end: 619 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 621, end: 627 },
              },
              loc: { start: 621, end: 627 },
            },
            loc: { start: 621, end: 628 },
          },
          directives: [],
          loc: { start: 615, end: 628 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "username",
            loc: { start: 631, end: 639 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 641, end: 647 },
              },
              loc: { start: 641, end: 647 },
            },
            loc: { start: 641, end: 648 },
          },
          directives: [],
          loc: { start: 631, end: 648 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "password",
            loc: { start: 651, end: 659 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 661, end: 667 },
              },
              loc: { start: 661, end: 667 },
            },
            loc: { start: 661, end: 668 },
          },
          directives: [],
          loc: { start: 651, end: 668 },
        },
      ],
      loc: { start: 578, end: 670 },
    },
    {
      kind: "UnionTypeDefinition",
      name: {
        kind: "Name",
        value: "CreateMailboxResponse",
        loc: { start: 678, end: 699 },
      },
      directives: [],
      types: [
        {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "NewMailbox",
            loc: { start: 702, end: 712 },
          },
          loc: { start: 702, end: 712 },
        },
        {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "InvalidApiKeyError",
            loc: { start: 715, end: 733 },
          },
          loc: { start: 715, end: 733 },
        },
      ],
      loc: { start: 672, end: 733 },
    },
    {
      kind: "ObjectTypeExtension",
      name: { kind: "Name", value: "Mutation", loc: { start: 747, end: 755 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "createMailbox",
            loc: { start: 760, end: 773 },
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "apiKey",
                loc: { start: 774, end: 780 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                    loc: { start: 782, end: 784 },
                  },
                  loc: { start: 782, end: 784 },
                },
                loc: { start: 782, end: 785 },
              },
              directives: [],
              loc: { start: 774, end: 785 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "CreateMailboxResponse",
              loc: { start: 788, end: 809 },
            },
            loc: { start: 788, end: 809 },
          },
          directives: [],
          loc: { start: 760, end: 809 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "login", loc: { start: 812, end: 817 } },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "username",
                loc: { start: 818, end: 826 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "String",
                    loc: { start: 828, end: 834 },
                  },
                  loc: { start: 828, end: 834 },
                },
                loc: { start: 828, end: 835 },
              },
              directives: [],
              loc: { start: 818, end: 835 },
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "password",
                loc: { start: 837, end: 845 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "String",
                    loc: { start: 847, end: 853 },
                  },
                  loc: { start: 847, end: 853 },
                },
                loc: { start: 847, end: 854 },
              },
              directives: [],
              loc: { start: 837, end: 854 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
              loc: { start: 857, end: 864 },
            },
            loc: { start: 857, end: 864 },
          },
          directives: [],
          loc: { start: 812, end: 864 },
        },
      ],
      loc: { start: 735, end: 866 },
    },
    {
      kind: "ObjectTypeExtension",
      name: { kind: "Name", value: "Query", loc: { start: 879, end: 884 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "mailbox",
            loc: { start: 889, end: 896 },
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "name",
                loc: { start: 897, end: 901 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "String",
                    loc: { start: 903, end: 909 },
                  },
                  loc: { start: 903, end: 909 },
                },
                loc: { start: 903, end: 910 },
              },
              directives: [],
              loc: { start: 897, end: 910 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Mailbox",
              loc: { start: 913, end: 920 },
            },
            loc: { start: 913, end: 920 },
          },
          directives: [],
          loc: { start: 889, end: 920 },
        },
      ],
      loc: { start: 867, end: 922 },
    },
  ],
  loc: { start: 0, end: 923 },
} as unknown as DocumentNode;
