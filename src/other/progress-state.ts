import { formatRel } from "../time";

class ProgressState {
  private allCount: number;
  private threshold: number;
  private prevTasksTimeMs: number[];
  private leftCount: number;
  private currStartTimeMs: number | null;

  /**
   * @param {number} allCount
   * @param {number=} threshold
   */
  constructor(allCount: number, threshold: number = 1.5) {
    this.allCount = allCount;
    this.threshold = threshold;

    this.prevTasksTimeMs = [];
    this.leftCount = allCount - this.prevTasksTimeMs.length;
    this.currStartTimeMs = null;
  }

  startTask(): void {
    this.currStartTimeMs = Date.now();
  }

  endTask(): void {
    this.prevTasksTimeMs.push(Date.now() - (this.currStartTimeMs as number));
    this.currStartTimeMs = null;
    this.leftCount -= 1;
  }

  get doneCount(): number {
    return this.allCount - this.leftCount;
  }

  countStateStr(): string {
    return `${this.doneCount}/${this.allCount}`;
  }

  predictRemainingTime(): number {
    const median = this.getMedian(this.prevTasksTimeMs);
    const absoluteDifferences = this.prevTasksTimeMs.map((time) =>
      Math.abs(time - median)
    );
    const medianAbsoluteDifference = this.getMedian(absoluteDifferences);

    const filteredTasks = this.prevTasksTimeMs.filter(
      (time, index) =>
        absoluteDifferences[index] <= this.threshold * medianAbsoluteDifference
    );

    const filteredAverageTimePerTask = this.getAverage(filteredTasks);

    const remainingTime = filteredAverageTimePerTask * this.leftCount;

    return Math.round(remainingTime / 1000);
  }

  private getMedian(array: number[]): number {
    const sortedArray = [...array].sort((a, b) => a - b);
    const middle = Math.floor(sortedArray.length / 2);

    if (sortedArray.length % 2 === 0) {
      return (sortedArray[middle - 1] + sortedArray[middle]) / 2;
    } else {
      return sortedArray[middle];
    }
  }

  private getAverage(array: number[]): number {
    return array.reduce((sum, time) => sum + time, 0) / array.length;
  }

  approxEndStr(): string {
    if (!this.prevTasksTimeMs.length) return "end undefined";

    return `${formatRel(this.predictRemainingTime())}`;
  }
}

export default ProgressState;
