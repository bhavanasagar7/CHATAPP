import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Baseurl } from '../../services/Api_Endpoint';
import { MdKeyboardVoice } from 'react-icons/md';
import { IoIosSend } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosVideocam } from 'react-icons/io';

export const Chat = ({ socket }) => {
  const { selectedUser } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([]);
  const [messagesend, setMessagesend] = useState(false);
  
  const ScrollRef = useRef();
  const inputvalue = useRef();

  const getMessages = async () => {
    if (!user || !selectedUser) return;
    try {
      const senderdata = {
        senderId: user._id,
        receiverId: selectedUser._id,
      };
      const res = await axios.post(`${Baseurl}/api/messages/get_messages`, senderdata);
      setMessages(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && selectedUser) {
      getMessages();
    }
  }, [selectedUser, user, messagesend]);

  useEffect(() => {
    if (socket) {
      socket.off('receiveMessage');
      socket.on('receiveMessage', (newMessage) => {
        if (newMessage.userId === selectedUser?._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });
    }
  }, [socket, selectedUser]);
  
  const handlemessaage = async () => {
    if (!selectedUser || !selectedUser._id) return;
    try {
      const messagedata = {
        senderId: user._id,
        receiverId: selectedUser._id,
        message: inputvalue.current.value,
      };
      socket.emit('sendMessage', { messagedata });
      setMessages((prevMessages) => [...prevMessages, { userId: user._id, message: inputvalue.current.value, time: Date.now() }]);
      await axios.post(`${Baseurl}/api/messages/send_message`, messagedata);
      inputvalue.current.value = '';
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (ScrollRef.current) {
      ScrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col">
      {!selectedUser ? (
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-gray-700 bg-white px-6 py-3 rounded-lg shadow-md">
            Get Started by Selecting a User
          </h1>
        </div>
      ) : (
        <>
          {/* Updated Chat Header */}
          <div className="w-full fixed top-0 z-10 flex justify-between items-center py-3 px-6 bg-[#F0F2F5] shadow-md">
            <div className="flex gap-4 items-center">
              <img
                src={selectedUser.profile}
                alt="Profile"
                className="rounded-full w-12 h-12 object-cover"
              />
              <h3 className='text-lg font-semibold'>{selectedUser.name}</h3>
            </div>
            <div className="flex gap-6">
              <button className="text-xl"><IoIosVideocam /></button>
              <button className="text-xl"><CiSearch /></button>
              <button className="text-xl"><BsThreeDotsVertical /></button>
            </div>
          </div>

          {/* Adjusted Chat Messages */}
          <div className="flex-1 overflow-y-auto mt-16 px-4 py-2">
            {messages.map((message, index) => (
              <div key={index} ref={ScrollRef} className={`my-2 ${message.userId === user._id ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block px-4 py-2 rounded-lg ${message.userId === user._id ? 'bg-green-300' : 'bg-gray-200'}`}>
                  {message.message}
                </span>
              </div>
            ))}
          </div>

          {/* Adjusted Input Field */}
          <div className="flex items-center p-4 sticky bottom-0 bg-gray-100 w-full border-t">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-white text-gray-800 rounded-md border focus:outline-none"
              ref={inputvalue}
            />
            <button className="text-2xl px-3" title="Voice Message">
              <MdKeyboardVoice />
            </button>
            <button className="text-2xl px-3" title="Send Message" onClick={handlemessaage}>
              <IoIosSend />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
