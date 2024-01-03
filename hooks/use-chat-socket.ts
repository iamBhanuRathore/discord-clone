import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  addKey, // socket key for adding a new message
  queryKey, // query key for finding the data to be updating in the react-query
  updateKey, // socket key for updating a existing message
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!socket) return;
    // socket for updating an existing message in the data
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        // checking if there is no data at all
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }
        // this map iterate -- first pages array then inside the pages array it iterates over the items inside a single page
        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });
        return { ...oldData, pages: newData };
      });
    });

    // adding a new message by the socket in the react query
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        // if there is no messages -- then we have to create a new react-query like structure for showing the first message
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }
        const newData = [...oldData.pages];
        newData[0] = { ...newData[0], items: [message, ...newData[0].items] };
        return {
          ...oldData,
          pages: newData,
        };
      });
    });
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, queryKey, socket, updateKey]);
};
