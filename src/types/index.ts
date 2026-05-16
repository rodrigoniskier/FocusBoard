export type Status = 'TODO' | 'DOING' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string[];
  createdAt: number;
}

export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    index: number;
    droppableId: string;
  };
  reason: 'DROP' | 'CANCEL';
  mode: 'FLUID' | 'SNAP';
  destination?: {
    droppableId: string;
    index: number;
  };
}
