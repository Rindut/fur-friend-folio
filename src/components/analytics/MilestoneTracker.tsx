
import { Card, CardContent } from "@/components/ui/card";
import { Award, CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Sample milestone data
const MILESTONES = [
  { id: 1, title: "Basic Commands", completed: true, date: "Jan 15, 2023" },
  { id: 2, title: "Leash Training", completed: true, date: "Feb 3, 2023" },
  { id: 3, title: "Socialization", completed: true, date: "Feb 28, 2023" },
  { id: 4, title: "Crate Training", completed: true, date: "Mar 10, 2023" },
  { id: 5, title: "Advanced Commands", completed: true, date: "Apr 5, 2023" },
  { id: 6, title: "Off-leash Reliability", completed: true, date: "May 18, 2023" },
  { id: 7, title: "Agility Basics", completed: true, date: "Jun 12, 2023" },
  { id: 8, title: "Advanced Agility", completed: false, date: "" },
  { id: 9, title: "Therapy Training", completed: false, date: "" },
  { id: 10, title: "Competition Ready", completed: false, date: "" },
];

interface MilestoneTrackerProps {
  completed: number;
  total: number;
  showDetails?: boolean;
}

const MilestoneTracker = ({ completed, total, showDetails = false }: MilestoneTrackerProps) => {
  const milestones = MILESTONES.slice(0, total);
  const completionPercentage = (completed / total) * 100;
  
  return (
    <div className="space-y-4">
      {!showDetails && (
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-grow">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{completed} of {total} completed</span>
              <span className="text-muted-foreground">{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>
      )}
      
      {showDetails && (
        <>
          <div className="bg-muted/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-lavender/20 p-3 rounded-full">
                <Award className="h-6 w-6 text-lavender" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium mb-1">Training Milestones</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{completed} of {total} completed</span>
                  <span className="font-medium">{completionPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            {milestones.map((milestone) => (
              <Card key={milestone.id} className={`${milestone.completed ? 'bg-muted/10' : ''} border ${milestone.completed ? 'border-sage/30' : 'border-muted'}`}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {milestone.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-sage" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className={`${milestone.completed ? 'font-medium' : 'text-muted-foreground'}`}>
                      {milestone.title}
                    </span>
                  </div>
                  {milestone.completed && (
                    <span className="text-xs text-muted-foreground">
                      {milestone.date}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {completionPercentage === 100 && (
            <div className="bg-sage/10 border border-sage/30 rounded-lg p-4 text-center mt-6">
              <div className="flex justify-center mb-2">
                <Award className="h-8 w-8 text-sage animate-bounce-gentle" />
              </div>
              <h3 className="font-medium text-lg">All milestones completed!</h3>
              <p className="text-sm text-muted-foreground">
                Amazing work! Your pet has achieved all training goals.
              </p>
            </div>
          )}
        </>
      )}
      
      {!showDetails && (
        <div className="space-y-1">
          {milestones.slice(0, 3).map((milestone) => (
            <div key={milestone.id} className="flex items-center gap-2">
              {milestone.completed ? (
                <CheckCircle2 className="h-4 w-4 text-sage shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className={`text-sm truncate ${milestone.completed ? '' : 'text-muted-foreground'}`}>
                {milestone.title}
              </span>
            </div>
          ))}
          {total > 3 && (
            <div className="text-xs text-muted-foreground pl-6">
              +{total - 3} more milestones
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MilestoneTracker;
