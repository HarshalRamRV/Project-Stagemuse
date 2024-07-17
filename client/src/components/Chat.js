import { React  } from "react";
import WidgetWrapper from "components/WidgetWrapper";
import ChatFooter from "./ChatFooter";
import ChatBody  from 'components/ChatBody';
import ChatHeader from './ChatHeader';

const Chat = ({ userId, _id }) => {
  return (
    <WidgetWrapper width="100%" height="100%">
    {userId &&(<ChatHeader userId={userId}/>)}
      <ChatBody receiverId={userId} senderId={_id}/>
      {userId &&(<ChatFooter receiverId={userId} senderId={_id}/>)}
    </WidgetWrapper>
  );
};
export default Chat;
