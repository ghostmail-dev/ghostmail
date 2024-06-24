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
      name: {
        kind: "Name",
        value: "EmailAttachment",
        loc: { start: 119, end: 134 },
      },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "filename",
            loc: { start: 139, end: 147 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 149, end: 155 },
            },
            loc: { start: 149, end: 155 },
          },
          directives: [],
          loc: { start: 139, end: 155 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "contentType",
            loc: { start: 158, end: 169 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 171, end: 177 },
            },
            loc: { start: 171, end: 177 },
          },
          directives: [],
          loc: { start: 158, end: 177 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "contentDisposition",
            loc: { start: 180, end: 198 },
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
          loc: { start: 180, end: 206 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "contentId",
            loc: { start: 209, end: 218 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 220, end: 226 },
            },
            loc: { start: 220, end: 226 },
          },
          directives: [],
          loc: { start: 209, end: 226 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "transferEncoding",
            loc: { start: 229, end: 245 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 247, end: 253 },
            },
            loc: { start: 247, end: 253 },
          },
          directives: [],
          loc: { start: 229, end: 253 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "generatedFileName",
            loc: { start: 256, end: 273 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 275, end: 281 },
            },
            loc: { start: 275, end: 281 },
          },
          directives: [],
          loc: { start: 256, end: 281 },
        },
        {
          kind: "FieldDefinition",
          description: {
            kind: "StringValue",
            value: "The size of the attachment in bytes.",
            block: false,
            loc: { start: 284, end: 322 },
          },
          name: { kind: "Name", value: "size", loc: { start: 325, end: 329 } },
          arguments: [],
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "Int", loc: { start: 331, end: 334 } },
            loc: { start: 331, end: 334 },
          },
          directives: [],
          loc: { start: 284, end: 334 },
        },
      ],
      loc: { start: 114, end: 336 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "Email", loc: { start: 343, end: 348 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "_id", loc: { start: 353, end: 356 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ID",
                loc: { start: 358, end: 360 },
              },
              loc: { start: 358, end: 360 },
            },
            loc: { start: 358, end: 361 },
          },
          directives: [],
          loc: { start: 353, end: 361 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "html", loc: { start: 364, end: 368 } },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 370, end: 376 },
            },
            loc: { start: 370, end: 376 },
          },
          directives: [],
          loc: { start: 364, end: 376 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "text", loc: { start: 379, end: 383 } },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 385, end: 391 },
            },
            loc: { start: 385, end: 391 },
          },
          directives: [],
          loc: { start: 379, end: 391 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "textAsHtml",
            loc: { start: 394, end: 404 },
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
          loc: { start: 394, end: 412 },
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
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "Date",
                loc: { start: 439, end: 443 },
              },
              loc: { start: 439, end: 443 },
            },
            loc: { start: 439, end: 444 },
          },
          directives: [],
          loc: { start: 433, end: 444 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "messageId",
            loc: { start: 447, end: 456 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 458, end: 464 },
            },
            loc: { start: 458, end: 464 },
          },
          directives: [],
          loc: { start: 447, end: 464 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "fromText",
            loc: { start: 467, end: 475 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 477, end: 483 },
            },
            loc: { start: 477, end: 483 },
          },
          directives: [],
          loc: { start: 467, end: 483 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "toText",
            loc: { start: 486, end: 492 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 494, end: 500 },
            },
            loc: { start: 494, end: 500 },
          },
          directives: [],
          loc: { start: 486, end: 500 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "attachments",
            loc: { start: 503, end: 514 },
          },
          arguments: [],
          type: {
            kind: "ListType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "EmailAttachment",
                loc: { start: 517, end: 532 },
              },
              loc: { start: 517, end: 532 },
            },
            loc: { start: 516, end: 533 },
          },
          directives: [],
          loc: { start: 503, end: 533 },
        },
      ],
      loc: { start: 338, end: 535 },
    },
    {
      kind: "ObjectTypeExtension",
      name: { kind: "Name", value: "Query", loc: { start: 548, end: 553 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "email", loc: { start: 558, end: 563 } },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "_id",
                loc: { start: 564, end: 567 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                    loc: { start: 569, end: 571 },
                  },
                  loc: { start: 569, end: 571 },
                },
                loc: { start: 569, end: 572 },
              },
              directives: [],
              loc: { start: 564, end: 572 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Email",
              loc: { start: 575, end: 580 },
            },
            loc: { start: 575, end: 580 },
          },
          directives: [],
          loc: { start: 558, end: 580 },
        },
      ],
      loc: { start: 536, end: 582 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "Mailbox", loc: { start: 588, end: 595 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "_id", loc: { start: 600, end: 603 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ObjectID",
                loc: { start: 605, end: 613 },
              },
              loc: { start: 605, end: 613 },
            },
            loc: { start: 605, end: 614 },
          },
          directives: [],
          loc: { start: 600, end: 614 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "name", loc: { start: 617, end: 621 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 623, end: 629 },
              },
              loc: { start: 623, end: 629 },
            },
            loc: { start: 623, end: 630 },
          },
          directives: [],
          loc: { start: 617, end: 630 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "username",
            loc: { start: 633, end: 641 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 643, end: 649 },
              },
              loc: { start: 643, end: 649 },
            },
            loc: { start: 643, end: 650 },
          },
          directives: [],
          loc: { start: 633, end: 650 },
        },
      ],
      loc: { start: 583, end: 652 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "Message", loc: { start: 658, end: 665 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "emailId",
            loc: { start: 670, end: 677 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ObjectID",
                loc: { start: 679, end: 687 },
              },
              loc: { start: 679, end: 687 },
            },
            loc: { start: 679, end: 688 },
          },
          directives: [],
          loc: { start: 670, end: 688 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "sender",
            loc: { start: 691, end: 697 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 699, end: 705 },
            },
            loc: { start: 699, end: 705 },
          },
          directives: [],
          loc: { start: 691, end: 705 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "subject",
            loc: { start: 708, end: 715 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "String",
              loc: { start: 717, end: 723 },
            },
            loc: { start: 717, end: 723 },
          },
          directives: [],
          loc: { start: 708, end: 723 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "date", loc: { start: 726, end: 730 } },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Date",
              loc: { start: 732, end: 736 },
            },
            loc: { start: 732, end: 736 },
          },
          directives: [],
          loc: { start: 726, end: 736 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "isRead",
            loc: { start: 739, end: 745 },
          },
          arguments: [],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
              loc: { start: 747, end: 754 },
            },
            loc: { start: 747, end: 754 },
          },
          directives: [],
          loc: { start: 739, end: 754 },
        },
      ],
      loc: { start: 653, end: 756 },
    },
    {
      kind: "ObjectTypeExtension",
      name: { kind: "Name", value: "Mailbox", loc: { start: 770, end: 777 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "messages",
            loc: { start: 782, end: 790 },
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
                    loc: { start: 793, end: 800 },
                  },
                  loc: { start: 793, end: 800 },
                },
                loc: { start: 793, end: 801 },
              },
              loc: { start: 792, end: 802 },
            },
            loc: { start: 792, end: 803 },
          },
          directives: [],
          loc: { start: 782, end: 803 },
        },
      ],
      loc: { start: 758, end: 805 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "InvalidApiKeyError",
        loc: { start: 811, end: 829 },
      },
      interfaces: [
        {
          kind: "NamedType",
          name: { kind: "Name", value: "Error", loc: { start: 841, end: 846 } },
          loc: { start: 841, end: 846 },
        },
      ],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "message",
            loc: { start: 851, end: 858 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 860, end: 866 },
              },
              loc: { start: 860, end: 866 },
            },
            loc: { start: 860, end: 867 },
          },
          directives: [],
          loc: { start: 851, end: 867 },
        },
      ],
      loc: { start: 806, end: 869 },
    },
    {
      kind: "ObjectTypeDefinition",
      name: {
        kind: "Name",
        value: "NewMailbox",
        loc: { start: 876, end: 886 },
      },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "_id", loc: { start: 891, end: 894 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "ObjectID",
                loc: { start: 896, end: 904 },
              },
              loc: { start: 896, end: 904 },
            },
            loc: { start: 896, end: 905 },
          },
          directives: [],
          loc: { start: 891, end: 905 },
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "name", loc: { start: 908, end: 912 } },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 914, end: 920 },
              },
              loc: { start: 914, end: 920 },
            },
            loc: { start: 914, end: 921 },
          },
          directives: [],
          loc: { start: 908, end: 921 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "username",
            loc: { start: 924, end: 932 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 934, end: 940 },
              },
              loc: { start: 934, end: 940 },
            },
            loc: { start: 934, end: 941 },
          },
          directives: [],
          loc: { start: 924, end: 941 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "password",
            loc: { start: 944, end: 952 },
          },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String",
                loc: { start: 954, end: 960 },
              },
              loc: { start: 954, end: 960 },
            },
            loc: { start: 954, end: 961 },
          },
          directives: [],
          loc: { start: 944, end: 961 },
        },
      ],
      loc: { start: 871, end: 963 },
    },
    {
      kind: "UnionTypeDefinition",
      name: {
        kind: "Name",
        value: "CreateMailboxResponse",
        loc: { start: 971, end: 992 },
      },
      directives: [],
      types: [
        {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "NewMailbox",
            loc: { start: 995, end: 1005 },
          },
          loc: { start: 995, end: 1005 },
        },
        {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "InvalidApiKeyError",
            loc: { start: 1008, end: 1026 },
          },
          loc: { start: 1008, end: 1026 },
        },
      ],
      loc: { start: 965, end: 1026 },
    },
    {
      kind: "ObjectTypeExtension",
      name: {
        kind: "Name",
        value: "Mutation",
        loc: { start: 1040, end: 1048 },
      },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "createMailbox",
            loc: { start: 1053, end: 1066 },
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "apiKey",
                loc: { start: 1067, end: 1073 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                    loc: { start: 1075, end: 1077 },
                  },
                  loc: { start: 1075, end: 1077 },
                },
                loc: { start: 1075, end: 1078 },
              },
              directives: [],
              loc: { start: 1067, end: 1078 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "CreateMailboxResponse",
              loc: { start: 1081, end: 1102 },
            },
            loc: { start: 1081, end: 1102 },
          },
          directives: [],
          loc: { start: 1053, end: 1102 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "login",
            loc: { start: 1105, end: 1110 },
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "username",
                loc: { start: 1111, end: 1119 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "String",
                    loc: { start: 1121, end: 1127 },
                  },
                  loc: { start: 1121, end: 1127 },
                },
                loc: { start: 1121, end: 1128 },
              },
              directives: [],
              loc: { start: 1111, end: 1128 },
            },
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "password",
                loc: { start: 1130, end: 1138 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "String",
                    loc: { start: 1140, end: 1146 },
                  },
                  loc: { start: 1140, end: 1146 },
                },
                loc: { start: 1140, end: 1147 },
              },
              directives: [],
              loc: { start: 1130, end: 1147 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
              loc: { start: 1150, end: 1157 },
            },
            loc: { start: 1150, end: 1157 },
          },
          directives: [],
          loc: { start: 1105, end: 1157 },
        },
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "readMail",
            loc: { start: 1160, end: 1168 },
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "mailId",
                loc: { start: 1169, end: 1175 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "ID",
                    loc: { start: 1177, end: 1179 },
                  },
                  loc: { start: 1177, end: 1179 },
                },
                loc: { start: 1177, end: 1180 },
              },
              directives: [],
              loc: { start: 1169, end: 1180 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Boolean",
              loc: { start: 1183, end: 1190 },
            },
            loc: { start: 1183, end: 1190 },
          },
          directives: [],
          loc: { start: 1160, end: 1190 },
        },
      ],
      loc: { start: 1028, end: 1192 },
    },
    {
      kind: "ObjectTypeExtension",
      name: { kind: "Name", value: "Query", loc: { start: 1205, end: 1210 } },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: {
            kind: "Name",
            value: "mailbox",
            loc: { start: 1215, end: 1222 },
          },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: {
                kind: "Name",
                value: "name",
                loc: { start: 1223, end: 1227 },
              },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: {
                    kind: "Name",
                    value: "String",
                    loc: { start: 1229, end: 1235 },
                  },
                  loc: { start: 1229, end: 1235 },
                },
                loc: { start: 1229, end: 1236 },
              },
              directives: [],
              loc: { start: 1223, end: 1236 },
            },
          ],
          type: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "Mailbox",
              loc: { start: 1239, end: 1246 },
            },
            loc: { start: 1239, end: 1246 },
          },
          directives: [],
          loc: { start: 1215, end: 1246 },
        },
      ],
      loc: { start: 1193, end: 1248 },
    },
  ],
  loc: { start: 0, end: 1249 },
} as unknown as DocumentNode;
