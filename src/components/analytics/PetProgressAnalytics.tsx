
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  TrendingUp, 
  Heart, 
  Award, 
  Syringe, 
  Pill, 
  Calendar, 
  ChevronRight, 
  BarChart2, 
  LineChart
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import WeightChart from './WeightChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MilestoneTracker from './MilestoneTracker';
import { Link } from 'react-router-dom';

// Sample data for visualization
const sampleData = {
  weight: [
    { date: '2023-01-01', value: 15 },
    { date: '2023-02-01', value: 16 },
    { date: '2023-03-01', value: 16.5 },
    { date: '2023-04-01', value: 17 },
    { date: '2023-05-01', value: 17.2 },
    { date: '2023-06-01', value: 17.5 },
  ],
  activityLevels: {
    daily: 75,
    weekly: 82,
    monthly: 78
  },
  healthScore: 92,
  milestonesCompleted: 7,
  milestonesTotal: 10,
  upcomingVaccinations: [
    { name: 'Rabies Booster', date: '2023-08-15' },
    { name: 'DHPP', date: '2023-09-22' }
  ],
  medicationAdherence: 95,
};

const PetProgressAnalytics = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Activity className="text-coral w-5 h-5" /> Pet Progress & Analytics
        </h2>
        <Link to="/analytics" className="text-sm text-coral hover:text-coral/80 font-medium flex items-center gap-1">
          Full Analytics <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard 
              title="Weight Trend"
              value="Healthy Growth"
              icon={<TrendingUp className="w-4 h-4 text-coral" />}
              description={`Current: ${sampleData.weight[sampleData.weight.length-1].value} lbs`}
              trend="up"
            />
            
            <MetricCard 
              title="Activity Level"
              value={`${sampleData.activityLevels[activeTimeframe]}%`}
              icon={<Activity className="w-4 h-4 text-sage" />}
              description="Above average"
              trend="up"
            />
            
            <MetricCard 
              title="Health Score"
              value={`${sampleData.healthScore}/100`}
              icon={<Heart className="w-4 h-4 text-coral" />}
              description="Excellent condition"
              trend="stable"
            />
            
            <MetricCard 
              title="Milestones"
              value={`${sampleData.milestonesCompleted}/${sampleData.milestonesTotal}`}
              icon={<Award className="w-4 h-4 text-lavender" />}
              description="On track"
              trend="up"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Weight Progression</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightChart data={sampleData.weight} />
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <LineChart className="w-4 h-4" /> View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Milestone Progress</CardTitle>
                <CardDescription>Training & development goals</CardDescription>
              </CardHeader>
              <CardContent>
                <MilestoneTracker 
                  completed={sampleData.milestonesCompleted} 
                  total={sampleData.milestonesTotal} 
                />
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <BarChart2 className="w-4 h-4" /> View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Syringe className="w-4 h-4 text-coral" /> Vaccination Schedule
                </CardTitle>
                <CardDescription>Upcoming vaccinations</CardDescription>
              </CardHeader>
              <CardContent>
                {sampleData.upcomingVaccinations.map((vaccination, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="font-medium">{vaccination.name}</span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {vaccination.date}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pill className="w-4 h-4 text-lavender" /> Medication Tracking
                </CardTitle>
                <CardDescription>Monthly adherence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Medication Adherence</span>
                    <span className="text-sm font-medium">{sampleData.medicationAdherence}%</span>
                  </div>
                  <Progress value={sampleData.medicationAdherence} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Great job! You've been consistent with medication.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="weight">
          <Card>
            <CardHeader>
              <CardTitle>Weight History</CardTitle>
              <CardDescription>Track your pet's weight over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <WeightChart data={sampleData.weight} showDetails />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Levels</CardTitle>
              <CardDescription>Daily, weekly, and monthly activity patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-4 mb-4">
                <Button 
                  variant={activeTimeframe === 'daily' ? 'default' : 'outline'}
                  onClick={() => setActiveTimeframe('daily')}
                >
                  Daily
                </Button>
                <Button 
                  variant={activeTimeframe === 'weekly' ? 'default' : 'outline'}
                  onClick={() => setActiveTimeframe('weekly')}
                >
                  Weekly
                </Button>
                <Button 
                  variant={activeTimeframe === 'monthly' ? 'default' : 'outline'}
                  onClick={() => setActiveTimeframe('monthly')}
                >
                  Monthly
                </Button>
              </div>
              
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative w-48 h-48">
                  <div 
                    className="absolute inset-0 rounded-full bg-sage/20"
                    style={{ 
                      background: `conic-gradient(var(--sage) ${sampleData.activityLevels[activeTimeframe]}%, transparent 0)`,
                      borderRadius: '100%'
                    }}
                  />
                  <div className="absolute inset-3 flex items-center justify-center bg-white rounded-full">
                    <span className="text-3xl font-bold">{sampleData.activityLevels[activeTimeframe]}%</span>
                  </div>
                </div>
                <p className="mt-6 text-center text-muted-foreground">
                  {activeTimeframe === 'daily' && 'Your pet has been active for 75% of their target today.'}
                  {activeTimeframe === 'weekly' && 'Weekly activity is above average at 82% of target.'}
                  {activeTimeframe === 'monthly' && 'Monthly activity level is steady at 78% of target.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health Indicators</CardTitle>
              <CardDescription>Overall health status and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="var(--border)" 
                      strokeWidth="10"
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="var(--coral)" 
                      strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 45 * sampleData.healthScore / 100} ${2 * Math.PI * 45 * (1 - sampleData.healthScore / 100)}`}
                      strokeDashoffset={2 * Math.PI * 45 * 0.25}
                      style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                    <text 
                      x="50" 
                      y="50" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      fontSize="24"
                      fontWeight="bold"
                      fill="currentColor"
                    >
                      {sampleData.healthScore}
                    </text>
                    <text 
                      x="50" 
                      y="65" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      fontSize="10"
                      fill="var(--muted-foreground)"
                    >
                      Health Score
                    </text>
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Nutrition</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Good</span>
                    <Progress value={85} className="w-32 h-2" />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Exercise</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Excellent</span>
                    <Progress value={95} className="w-32 h-2" />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Dental Health</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Good</span>
                    <Progress value={80} className="w-32 h-2" />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Coat Condition</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Excellent</span>
                    <Progress value={95} className="w-32 h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones">
          <MilestoneTracker completed={sampleData.milestonesCompleted} total={sampleData.milestonesTotal} showDetails />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component for metric cards
const MetricCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend 
}: { 
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend: 'up' | 'down' | 'stable';
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {icon}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h4 className="text-2xl font-bold">{value}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`
            flex items-center text-xs font-medium
            ${trend === 'up' ? 'text-green-500' : ''}
            ${trend === 'down' ? 'text-red-500' : ''}
            ${trend === 'stable' ? 'text-blue-500' : ''}
          `}>
            {trend === 'up' && '↑ 5%'}
            {trend === 'down' && '↓ 3%'}
            {trend === 'stable' && '→ Stable'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetProgressAnalytics;
