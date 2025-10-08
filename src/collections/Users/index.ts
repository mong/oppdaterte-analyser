import type { CollectionConfig } from "payload";

import { authenticated } from "../../access/authenticated";
import { loginCredentials } from "@/lib/authorization";

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    admin: authenticated,
    create: () => false,
    delete: () => false,
    read: authenticated,
    update: () => false,
  },
  admin: {
    defaultColumns: ["name", "email"],
    useAsTitle: "name",
  },
  auth: {
    disableLocalStrategy: true,
    strategies: [
      {
        name: 'entra-id-strategy',
        authenticate: async ({ payload, headers }) => {
          const credentials = await loginCredentials();
          if (!credentials) {
            return { user: null };
          }

          const usersQuery = await payload.find({
            collection: 'users',
            where: {
              email: {
                equals: credentials.email,
              },
            },
          })
          
          if (!usersQuery.docs[0]) {
            const user = await payload.create({
              collection: 'users',
              data: {
                name: credentials.userName,
                email: credentials.email,
              },
            });
            return { user: { collection: 'users', ...user } };
          }

          return {
            user: usersQuery.docs[0] ? { collection: 'users', ...usersQuery.docs[0]} : null,
          }
        }
      }
    ]
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      unique: true,
      required: true,
    }
  ],
  timestamps: true,
};
