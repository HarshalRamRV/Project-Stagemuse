import Message from '../models/Message.js';

export const createMessage = async (data, io) => {
  try {
    const newMessage = new Message({
      text: data.text,
      senderId: data.senderId,
      receiverId: data.receiverId,
      unread: true, // Set as unread when creating
    });
    const message = await newMessage.save();
    io.emit("newMessage", message);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error saving message:', error);
  }
};


  export const getMessagesBetweenUsers = async (req, res) => {
    try {
      const { senderId, receiverId } = req.params;
      
      const messages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ createdAt: 1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(404).json({ message: error.message });
      
    }
    
  };
  
  export const markMessagesAsRead = async (req, res) => {
    try {
      const { senderId, receiverId } = req.params;
      
      await Message.updateMany(
        {
          senderId,
          receiverId,
          unread: true, // Only update unread messages
        },
        { $set: { unread: false } }
      );
  
      res.status(200).json({ message: "Messages marked as read." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getUnreadMessageCounts = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const unreadCounts = await Message.aggregate([
        {
          $match: {
            receiverId: userId,
            unread: true,
          },
        },
        {
          $group: {
            _id: "$senderId",
            count: { $sum: 1 },
          },
        },
      ]);
  
      const unreadCountsMap = {};
      unreadCounts.forEach((entry) => {
        unreadCountsMap[entry._id] = entry.count;
      });
      res.status(200).json({ unreadCounts: unreadCountsMap });
    } catch (error) {
      res.status(304).json({ message: error.message });
    }
  };