import { useEffect, useState } from 'react';

type User = {
  id: number;
  username: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  data: User[];
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    fetch('http://8.153.108.99:3000/users')
      .then(res => res.json())
      .then((res: ApiResponse) => {
        if (res.success) {
          setUsers(res.data);
        }
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>用户列表</h2>

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc' }}>ID</th>
            <th style={{ border: '1px solid #ccc' }}>用户名</th>
            <th style={{ border: '1px solid #ccc' }}>角色</th>
            <th style={{ border: '1px solid #ccc' }}>创建时间</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: '1px solid #ccc' }}>{user.id}</td>
              <td style={{ border: '1px solid #ccc' }}>{user.username}</td>
              <td style={{ border: '1px solid #ccc' }}>{user.role}</td>
              <td style={{ border: '1px solid #ccc' }}>
                {new Date(user.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}