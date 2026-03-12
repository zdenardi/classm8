import { Router } from '@oak/oak';
import { Course, PrismaClient } from '@/prisma';
import { CourseFormValues } from '../../../../src/features/course/schema.ts';
import { clerkAuth } from '../../../middleware/clerkAuth.ts';

const courseRouter = new Router();

courseRouter.get('/courses', clerkAuth, async (context) => {
	const db = context.app.state.prisma;
	const courses = await db.course.findMany({
		include: {
			students: {
				include: { user: true },
			},
		},
	});
	context.response.body = courses;
});

courseRouter.get('/courses/:id', clerkAuth, async (context) => {
	const db = context.app.state.prisma;
	const { id } = context.params;
	const courses = await db.course.findUnique({
		where: {
			id: Number(id),
		},
		include: {
			students: {
				include: { user: true },
			},
		},
	});
	context.response.body = courses;
});

courseRouter.post('/courses', clerkAuth, async (context) => {
	const data: CourseFormValues = await context
		.request.body.json();
	const db = context.app.state.prisma;

	// Extract repeatNum and other fields
	const { repeatNum, startDate, startTime, endTime, location, ...courseData } =
		data;

	// Create the course first
	const createdCourse = await db.course.create({
		data: courseData,
	});

	// Create classes for each week
	if (repeatNum && repeatNum > 0) {
		const classesToCreate = [];

		// Parse the start date properly to avoid timezone issues
		const [startYear, startMonth, startDay] = startDate.split('-').map(Number);

		for (let i = 0; i < repeatNum; i++) {
			// Calculate the date for this week
			const weekDate = new Date(startYear, startMonth - 1, startDay);
			weekDate.setDate(weekDate.getDate() + i * 7);

			// Create start datetime by combining date and start time
			const [startHour, startMinute] = startTime.split(':').map(Number);
			const classStartDate = new Date(weekDate);
			classStartDate.setHours(startHour, startMinute, 0, 0);

			// Create end datetime by combining date and end time
			const [endHour, endMinute] = endTime.split(':').map(Number);
			const classEndDate = new Date(weekDate);
			classEndDate.setHours(endHour, endMinute, 0, 0);

			classesToCreate.push({
				courseId: createdCourse.id,
				location: location,
				notes: `Week ${i + 1}`,
				streamingLink: '',
				startDate: classStartDate,
				endDate: classEndDate,
			});
		}

		// Bulk create all classes
		await db.class.createMany({
			data: classesToCreate,
		});
	}

	// Return the course with its classes
	const courseWithClasses = await db.course.findUnique({
		where: { id: createdCourse.id },
		include: {
			classes: true,
			instructor: true,
		},
	});

	context.response.body = courseWithClasses;
});

courseRouter.patch('/courses/:id', clerkAuth, async (context) => {
	const id = await context.params.id;
	const data: Course = await context.request.body.json();
	const db: PrismaClient = context.app.state.prisma;

	if (parseInt(id) != data.id) {
		context.response.status = 400;
	}

	const updatedCourse = await db.course.update({
		where: {
			id: data.id,
		},
		data,
		include: {
			instructor: true,
			students: {
				include: {
					user: true,
				},
			},
			classes: {
				include: {
					scenes: {
						include: {
							scene: true,
						},
					},
				},
			},
		},
	});
	return (context.response.body = updatedCourse);
});

courseRouter.delete('/courses/:id', clerkAuth, async (context) => {
	const id = await context.params.id;
	const db: PrismaClient = context.app.state.prisma;

	await db.course.delete({
		where: {
			id: Number(id),
		},
	});
	context.response.status = 204;
});

export default courseRouter;
