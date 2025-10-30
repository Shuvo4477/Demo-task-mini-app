import React, { useState } from 'react';

// NOTE: যেহেতু আপনি .tsx ফাইল এডিট করছেন, টাইপস্ক্রিপ্ট ট্যাগগুলি রাখতে হবে
// যদি টেমপ্লেটটি শুধুমাত্র .jsx হয়, তবে : React.FC এবং 'initData' এর কিছু অংশ মুছে দিতে হতে পারে।

// এই ফাংশনটি আপনাকে টেলিগ্রাম অ্যাপের SDK ব্যবহার করে তথ্য পেতে সাহায্য করবে
const getTelegramWebApp = () => {
  return window.Telegram && window.Telegram.WebApp;
};

const App = () => {
  const webApp = getTelegramWebApp();
  const initDataUnsafe = webApp ? webApp.initDataUnsafe : {};
  const user = initDataUnsafe.user || { first_name: 'ব্যবহারকারী', id: 'XXXX' };
  
  // ডামি ডেটা (এই ডেটা পরে আপনার ব্যাকএন্ড থেকে লোড করতে হবে)
  const [balance, setBalance] = useState(12450);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'দৈনিক বিজ্ঞাপন দেখুন', reward: 50, completed: false },
    { id: 2, title: 'আমাদের টেলিগ্রাম চ্যানেলে যোগ দিন', reward: 500, completed: false },
    { id: 3, title: 'একটি বন্ধুকে রেফার করুন', reward: 1000, completed: false },
  ]);

  const handleTaskComplete = (taskId, reward) => {
    // শুধুমাত্র ফ্রন্টএন্ডে স্ট্যাটাস পরিবর্তন
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    setBalance(prevBalance => prevBalance + reward);
    
    // টেলিগ্রাম পপআপ মেসেজ
    if(webApp) {
        webApp.showAlert(`অভিনন্দন! আপনি ${reward} কয়েন পেয়েছেন।`);
    }
    // ***মনে রাখবেন: আসল ডেটা সংরক্ষণের জন্য ব্যাকএন্ড প্রয়োজন।***
  };

  // টেলিগ্রাম থিম কালার
  const themeParams = webApp ? webApp.themeParams : {};
  const bgColor = themeParams.secondary_bg_color || '#1c1c1d'; // ডার্ক মোড
  const textColor = themeParams.text_color || '#ffffff';
  const hintColor = themeParams.hint_color || '#aaa';
  const buttonColor = themeParams.button_color || '#007aff';
  const buttonTextColor = themeParams.button_text_color || '#ffffff';

  return (
    <div style={{ backgroundColor: bgColor, color: textColor, minHeight: '100vh', padding: '16px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', padding: '10px 0', borderBottom: `1px solid ${hintColor}` }}>
        <h2 style={{ margin: 0 }}>টাস্ক উপার্জন মিনি অ্যাপ</h2>
        <p style={{ color: hintColor, margin: '5px 0 0 0' }}>স্বাগতম, {user.first_name}!</p>
      </header>

      {/* ব্যালেন্স কার্ড */}
      <div style={{ 
        backgroundColor: themeParams.background_color || '#2c2c2e', 
        padding: '20px', 
        borderRadius: '12px', 
        textAlign: 'center', 
        marginBottom: '30px' 
      }}>
        <p style={{ fontSize: '16px', margin: '0 0 5px 0', color: hintColor }}>মোট ব্যালেন্স</p>
        <h1 style={{ fontSize: '36px', margin: 0, fontWeight: 'bold' }}>💰 {balance}</h1>
        <button 
          style={{ 
            marginTop: '15px', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            backgroundColor: buttonColor,
            color: buttonTextColor,
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => webApp && webApp.showAlert('উত্তোলনের অনুরোধ প্রক্রিয়াধীন...')}
        >
          টাকা উত্তোলন (Withdraw)
        </button>
      </div>

      {/* টাস্ক সেকশন */}
      <section>
        <h3 style={{ borderLeft: `3px solid ${buttonColor}`, paddingLeft: '10px' }}>দৈনিক টাস্ক</h3>
        {tasks.map(task => (
          <div key={task.id} style={{
            backgroundColor: task.completed ? '#3a3a3c' : themeParams.background_color || '#2c2c2e', 
            padding: '15px', 
            borderRadius: '10px', 
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{task.title}</p>
              <span style={{ color: hintColor }}>+{task.reward} কয়েন</span>
            </div>
            <button 
              onClick={() => !task.completed && handleTaskComplete(task.id, task.reward)}
              disabled={task.completed}
              style={{
                padding: '8px 15px',
                borderRadius: '6px',
                backgroundColor: task.completed ? hintColor : buttonColor,
                color: buttonTextColor,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {task.completed ? 'সম্পন্ন' : 'শুরু করুন'}
            </button>
          </div>
        ))}
      </section>
      
      {/* রেফারেল সেকশন */}
      <section style={{ marginTop: '30px' }}>
         <h3 style={{ borderLeft: `3px solid ${buttonColor}`, paddingLeft: '10px' }}>বন্ধুদের আমন্ত্রণ জানান</h3>
         <div style={{
            backgroundColor: themeParams.background_color || '#2c2c2e', 
            padding: '15px', 
            borderRadius: '10px', 
            textAlign: 'center'
         }}>
             <p style={{ margin: '0 0 10px 0' }}>আপনার রেফারেল লিঙ্ক শেয়ার করুন:</p>
             <code style={{ 
                display: 'block', 
                backgroundColor: '#1c1c1d', 
                padding: '10px', 
                borderRadius: '6px', 
                overflowX: 'auto',
                color: '#fff'
             }}>
                https://t.me/YourBotUsername?start=ref_{user.id}
             </code>
             <button 
                onClick={() => webApp && webApp.copyText(`https://t.me/YourBotUsername?start=ref_${user.id}`)}
                style={{
                    marginTop: '15px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    backgroundColor: buttonColor,
                    color: buttonTextColor,
                    border: 'none',
                    cursor: 'pointer'
                }}
             >
                🔗 লিঙ্ক কপি করুন
             </button>
         </div>
      </section>

    </div>
  );
};

export default App;
