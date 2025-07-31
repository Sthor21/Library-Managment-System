import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, Filter, TrendingUp, Book, Users, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Reports = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [reportType, setReportType] = useState('overview');

  // Sample data for charts
  const borrowingTrends = [
    { month: 'Jan', borrowed: 65, returned: 70 },
    { month: 'Feb', borrowed: 78, returned: 72 },
    { month: 'Mar', borrowed: 90, returned: 85 },
    { month: 'Apr', borrowed: 81, returned: 88 },
    { month: 'May', borrowed: 95, returned: 90 },
    { month: 'Jun', borrowed: 102, returned: 98 },
  ];

  const categoryData = [
    { name: 'Fiction', value: 35, color: '#3B82F6' },
    { name: 'Science', value: 25, color: '#10B981' },
    { name: 'History', value: 20, color: '#F59E0B' },
    { name: 'Technology', value: 15, color: '#EF4444' },
    { name: 'Art', value: 5, color: '#8B5CF6' },
  ];

  const membershipGrowth = [
    { month: 'Jan', members: 120 },
    { month: 'Feb', members: 135 },
    { month: 'Mar', members: 155 },
    { month: 'Apr', members: 178 },
    { month: 'May', members: 195 },
    { month: 'Jun', members: 210 },
  ];

  const topBooks = [
    { title: 'The Future of AI', borrows: 45 },
    { title: 'Climate Solutions', borrows: 38 },
    { title: 'Digital Revolution', borrows: 32 },
    { title: 'Modern Psychology', borrows: 28 },
    { title: 'Ancient History', borrows: 25 },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Books Borrowed',
      value: '1,294',
      change: '+8.2%',
      changeType: 'positive',
      icon: Book,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'New Members',
      value: '89',
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Avg. Return Time',
      value: '18 days',
      change: '-2.1 days',
      changeType: 'positive',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Track library performance and insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Borrowing Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Borrowing Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={borrowingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="borrowed" fill="#3B82F6" name="Borrowed" />
                  <Bar dataKey="returned" fill="#10B981" name="Returned" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Popular Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <span className="font-medium">{category.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Membership Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={membershipGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="members" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Books */}
        <Card>
          <CardHeader>
            <CardTitle>Most Borrowed Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBooks.map((book, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{book.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(book.borrows / 45) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {book.borrows}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">94%</p>
                <p className="text-sm text-muted-foreground">Return Rate</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">4.8</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">76%</p>
                <p className="text-sm text-muted-foreground">Utilization</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">23</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Recent Insights</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>Fiction books up 15% this month</span>
                </li>
                <li className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span>Premium memberships increased 8%</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Average return time improved</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;